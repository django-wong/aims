export function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function currency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function hours(value: number) {
  return `${value.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})}h`;
}


export function distance(value: number, unit: string = 'km') {
  return `${value.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})}${unit}`;
}
