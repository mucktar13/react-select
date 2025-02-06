import { ChevronDown, Search, X } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/util";

export interface Option {
  value: string;
  label: string;
}

export type SingleValue<Option> = Option | null;
export type MultiValue<Option> = Option[];

interface SelectContextProps {
  options: Option[];
  filteredOptions: Option[];
  selectedOptions: Option[];
  searchQuery: string;
  isDropdownOpen: boolean;
  multiselect?: boolean;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDropdown: React.Dispatch<React.SetStateAction<void>>;
  handleOptionSelect: (option: Option) => void;
  handleOptionRemove: (optionToRemove: Option) => void;
}

export const SelectContext = createContext<SelectContextProps | undefined>(
  undefined
);

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (context === undefined) {
    throw new Error("useSelectContext must be used within a SelectProvider");
  }
  return context;
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

function transformToOptions(value: SingleValue<Option> | MultiValue<Option>) {
  const option: Option[] = [];

  if (!value) return option;

  if (Array.isArray(value)) {
    option.push(...value);
  } else {
    option.push(value);
  }

  return option;
}

interface SelectProps {
  options: Option[];
  value?: SingleValue<Option> | MultiValue<Option>;
  multiselect?: boolean;
  searchable?: boolean;
  dropdownStyle?: string;
  onChange?: (value: SingleValue<Option> | MultiValue<Option>) => void;
  renderItem?: (data: Option) => React.ReactNode;
}

const SelectProvider: React.FC<
  SelectProps & { children?: React.ReactNode }
> = ({ options, value, children, multiselect = false, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    transformToOptions(value ?? [])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedOptions.some(
        (selectedOption) => selectedOption.value === option.value
      )
  );

  useEffect(() => {
    setSelectedOptions(transformToOptions(value ?? []));
  }, [value]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option: Option) => {
    if (multiselect) {
      const selected = [...selectedOptions, option];
      setSelectedOptions(selected);
      onChange && onChange(selected);
    } else {
      setSelectedOptions([option]);
      onChange && onChange(option);
    }

    setIsDropdownOpen(false);
  };

  const handleOptionRemove = (optionToRemove: Option) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option !== optionToRemove)
    );
  };

  const contextValue: SelectContextProps = {
    options,
    filteredOptions,
    selectedOptions,
    searchQuery,
    isDropdownOpen,
    multiselect,
    setSelectedOptions,
    setSearchQuery,
    toggleDropdown,
    setIsDropdownOpen,
    handleOptionSelect,
    handleOptionRemove,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
};

const Select: React.FC<SelectProps> = (props) => {
  const { searchable = false, dropdownStyle, renderItem, ...restProps } = props;
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <SelectProvider {...restProps}>
      <SelectTrigger ref={triggerRef}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent triggerRef={triggerRef} className={dropdownStyle}>
        {searchable && <SelectSearch />}
        <SelectItems renderItem={renderItem} />
      </SelectContent>
    </SelectProvider>
  );
};

type SelectTriggerProps = React.PropsWithChildren & { className?: string };
const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  (props, ref) => {
    const { children, className } = props;

    const { isDropdownOpen, toggleDropdown } = useSelectContext();

    const handleTriggerAction = (e: React.MouseEvent<HTMLDivElement>) => {
      toggleDropdown();
      e.stopPropagation();
    };

    return (
      <div
        ref={ref}
        onClick={handleTriggerAction}
        className={cn(
          "relative p-2 min-h-[50px] w-[var(--dropdown-min-width)] border border-input rounded-lg bg-primary text-primary-foreground shadow hover:bg-primary/90 flex  items-center justify-between cursor-pointer",
          "group",
          className
        )}
        data-dropdown={isDropdownOpen ? "open" : "closed"}
      >
        {children}
        <ChevronDown
          size={14}
          className="absolute right-4 top-[calc(50% - 14px)] group-data-[dropdown=open]:rotate-180"
        />
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  className?: string;
}

const SelectValue = React.forwardRef<HTMLDivElement, SelectValueProps>(
  (props, ref) => {
    const { className } = props;
    const { multiselect, selectedOptions, setSelectedOptions } =
      useSelectContext();

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selectedOptions.filter(
          (s) => s.value !== option.value
        );
        setSelectedOptions(newOptions);
      },
      [selectedOptions]
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center gap-1", className)}
      >
        {!multiselect && selectedOptions.length > 0 && (
          <span className="text-sm">{selectedOptions[0].label}</span>
        )}

        {multiselect &&
          selectedOptions.map((option) => {
            return (
              <div
                key={option.value}
                className={
                  "relative h-8 p-1 flex items-center gap-2 cursor-default border border-gray-400 rounded-xl bg-background text-sm"
                }
              >
                {option.label}
                <button
                  className="size-4 cursor-pointer rounded-full flex items-center justify-center text-grey-300"
                  onClick={(e) => {
                    handleUnselect(option);
                    e.stopPropagation();
                  }}
                  aria-label="Remove"
                >
                  <X size={14} strokeWidth={2} className="fill-grey-200" />
                </button>
              </div>
            );
          })}
        {selectedOptions.length === 0 && (
          <span className="text-sm">Select an option</span>
        )}
      </div>
    );
  }
);

SelectValue.displayName = "SelectValue";

export type SelectSearchProps = {
  placeholder?: string;
};
const SelectSearch = React.forwardRef<HTMLDivElement, SelectSearchProps>(
  (props, ref) => {
    const { placeholder = "Search options..." } = props;
    const { setSearchQuery } = useSelectContext();
    const [search, setSearch] = useState<string>("");

    // Memoized debounced function
    const debouncedSearch = useCallback(
      debounce((search: string) => {
        setSearchQuery(search);
      }, 100),
      []
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;

      setSearch(query);
      debouncedSearch(query);
    };

    return (
      <div
        ref={ref}
        className="flex items-center gap-4 border-b border-b-input px-2 py-2"
      >
        <Search size={18} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full focus:outline-none text-md"
          value={search}
          onChange={handleSearch}
        />
      </div>
    );
  }
);

SelectSearch.displayName = "SelectSearch";

export type SelectItemsProps = {
  renderItem?: (data: Option) => React.ReactNode;
};

const SelectItems = React.forwardRef<HTMLUListElement, SelectItemsProps>(
  ({ renderItem }, ref) => {
    const { searchQuery, filteredOptions, handleOptionSelect } =
      useSelectContext();

    // Highlight matched text
    const highlightMatch = (text: string, query: string) => {
      if (!query) return text; // If no search term, return normal text
      const regex = new RegExp(`(${query})`, "gi"); // Case-insensitive match
      const parts = text.split(regex);
      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-sky-200">
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    const handleSelectItem = (option: Option) => () => {
      handleOptionSelect(option);
    };

    const renderDefaultItem = (option: Option) => {
      if (renderItem) {
        return (
          <li
            className="w-full"
            onClick={handleSelectItem(option)}
            key={option.value}
          >
            {renderItem(option)}
          </li>
        );
      } else {
        return (
          <li
            onClick={handleSelectItem(option)}
            key={option.value}
            className="w-full px-4 py-2 cursor-pointer hover:bg-blue-100 transition duration-200"
          >
            {highlightMatch(option.label, searchQuery)}
          </li>
        );
      }
    };

    return (
      <ul
        ref={ref}
        className="w-full flex flex-col items-center gap-2 py-2 max-h-48 overflow-y-auto"
      >
        {filteredOptions.map(renderDefaultItem)}

        {filteredOptions.length === 0 && (
          <li className="w-full px-4 py-2">No options found</li>
        )}
      </ul>
    );
  }
);

SelectItems.displayName = "SelectSearch";

type SelectContentProps = React.PropsWithChildren & {
  className?: string;
  triggerRef: React.RefObject<HTMLDivElement>;
};

const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className,
  triggerRef,
}) => {
  const { isDropdownOpen, setIsDropdownOpen } = useSelectContext();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideContent = elementRef.current?.contains(target) ?? false;
      const isInsideTrigger = triggerRef.current?.contains(target) ?? false;

      if (!isInsideContent && !isInsideTrigger) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute p-0 mt-1 bg-background border border-input rounded-lg transition-all duration-300 ease-in-out data-[state=open]:opacity-100 data-[state=open]:min-w-[var(--dropdown-min-width)] data-[state=open]:h-auto data-[state=closed]:opacity-0 data-[state=closed]:h-0",
        className
      )}
      data-state={isDropdownOpen ? "open" : "closed"}
    >
      {children}
    </div>
  );
};

SelectContent.displayName = "SelectContent";

export default Select;
