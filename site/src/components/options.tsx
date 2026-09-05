import { Link } from "@cloudflare/kumo/components/link";
import { Select } from "@cloudflare/kumo/components/select";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface OptionsProps {
  title: string;
  name: string;
  options: Option[];
  helperUrl?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export function Options(props: OptionsProps) {
  return (
    <div
      className="flex min-w-[100px] max-w-fit flex-col gap-1"
      data-testid={`widget-${props.name}-options`}
    >
      <span className="text-kumo-strong text-sm font-medium">
        {props.title}
        {props.helperUrl && (
          <Link className="ml-2" href={props.helperUrl} rel="noreferrer" target="_blank">
            ?
          </Link>
        )}
      </span>

      <Select
        aria-label={props.title}
        defaultValue={props.value ? undefined : props.options[0].value}
        items={props.options.map(option => ({ label: option.label, value: option.value }))}
        name={props.name}
        value={props.value}
        onValueChange={(value: string | null) => {
          if (value !== null) props.onChange?.(value);
        }}
      />
    </div>
  );
}
