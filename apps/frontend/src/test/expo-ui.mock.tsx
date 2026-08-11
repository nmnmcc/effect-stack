import { useMemo, useState, type PropsWithChildren, type ReactNode } from "react";
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  Pressable,
  View,
  type TextInputProps as NativeTextInputProps,
  type ViewProps,
} from "react-native";

interface ButtonProps {
  readonly disabled?: boolean;
  readonly label?: string;
  readonly onPress?: () => void;
}

interface CheckboxProps {
  readonly disabled?: boolean;
  readonly label?: string;
  readonly onValueChange: (value: boolean) => void;
  readonly value: boolean;
}

interface LayoutProps extends PropsWithChildren {
  readonly style?: ViewProps["style"];
}

interface ListItemProps extends PropsWithChildren {
  readonly leading?: ReactNode;
  readonly supportingText?: ReactNode;
  readonly trailing?: ReactNode;
}

interface ObservableState<T> {
  readonly get: () => T;
  readonly set: (value: T) => void;
}

interface TextInputProps extends Omit<NativeTextInputProps, "onSubmitEditing" | "value"> {
  readonly onSubmitEditing?: (text: string) => void;
  readonly value?: ObservableState<string>;
}

interface TextProps extends PropsWithChildren {
  readonly numberOfLines?: number;
}

export function Host({ children, ...props }: PropsWithChildren<ViewProps>) {
  return <View {...props}>{children}</View>;
}

export function Column({ children, style }: LayoutProps) {
  return <View style={style}>{children}</View>;
}

export function Row({ children, style }: LayoutProps) {
  return <View style={style}>{children}</View>;
}

export function List({ children }: PropsWithChildren) {
  return <View>{children}</View>;
}

export function ListItem({ children, leading, supportingText, trailing }: ListItemProps) {
  return (
    <View>
      {leading}
      {children}
      {supportingText === undefined ? null : <NativeText>{supportingText}</NativeText>}
      {trailing}
    </View>
  );
}

export function Text({ children, numberOfLines }: TextProps) {
  return <NativeText numberOfLines={numberOfLines}>{children}</NativeText>;
}

export function Button({ disabled, label, onPress }: ButtonProps) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" disabled={disabled} onPress={onPress}>
      <NativeText>{label}</NativeText>
    </Pressable>
  );
}

export function Checkbox({ disabled, label, onValueChange, value }: CheckboxProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
    >
      <NativeText>{label}</NativeText>
    </Pressable>
  );
}

export function TextInput({ onSubmitEditing, value, ...props }: TextInputProps) {
  return (
    <NativeTextInput
      {...props}
      onChangeText={(text) => {
        value?.set(text);
        props.onChangeText?.(text);
      }}
      onSubmitEditing={(event) => onSubmitEditing?.(event.nativeEvent.text)}
      value={value?.get()}
    />
  );
}

export function useNativeState<T>(initialValue: T): ObservableState<T> {
  const [value, setValue] = useState(initialValue);
  return useMemo(() => ({ get: () => value, set: setValue }), [value]);
}
