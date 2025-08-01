export function Divider(props: { orientation?: 'horizontal' | 'vertical', className?: string }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${props.orientation === 'vertical' ? 'border-l' : 'border-t'} ${props.className || ''}`}
      style={{ height: props.orientation === 'vertical' ? '100%' : '1px', width: props.orientation === 'vertical' ? '1px' : '100%' }}
    />
  );
}
