import { useEffect, useRef, useState } from 'react';

interface Dimension {
  width: number;
  height: number;
}

interface SizeAwareBuilderProps extends React.ComponentProps<'div'> {
  builder: (dimension: Dimension) => React.ReactNode;
}
export function SizeAwareBuilder({builder, ...props }: SizeAwareBuilderProps) {
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === ref.current) {
          const rect = entry.contentRect;
          setDimension({
            width: rect.width,
            height: rect.height,
          });
          // console.log('SizeAwareBuilder - updated size via ResizeObserver:', rect.width, rect.height);
        }
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
      // Initial size set
      const rect = ref.current.getBoundingClientRect();
      setDimension({
        width: rect.width,
        height: rect.height,
      });
      // console.log('SizeAwareBuilder - initial size set:', rect.width, rect.height);
    }

    return () => {
      resizeObserver.disconnect();
    };

    // function updateSize() {
    //   if (ref.current) {
    //     const rect = ref.current.getBoundingClientRect();
    //     setDimension({
    //       width: rect.width,
    //       height: rect.height,
    //     });
    //
    //     console.log('SizeAwareBuilder - updated size:', rect.width, rect.height);
    //   }
    // }
    //
    // updateSize();
    //
    // window.addEventListener('resize', updateSize);
    // return () => window.removeEventListener('resize', updateSize);
  }, [ref]);

  return (
    <div {...props} ref={ref}>
      {dimension && builder(dimension)}
    </div>
  );
}
