const UV_INDEX = [
  {
    name: 'low',
    min: 0,
    max: '2.9',
    color: '#06d6a0',
  },
  {
    name: 'moderate',
    min: 2,
    max: '5.9',
    color: '#ffbe0b',
  },
  {
    name: 'high',
    min: 5,
    max: '7.9',
    color: '#fb8500',
  },
  {
    name: 'veryHigh',
    min: 8,
    max: '10.9',
    color: '#e63946',
  },
  {
    name: 'extreme',
    min: 11,
    max: 9999,
    color: '#6a4c93',
  },
];

export const getUVColor = (uv) => {
  return (
    UV_INDEX.find(
      (item) =>
        Number(uv) >= Number(item.min) && Number(uv) <= Number(item.max),
    )?.color ?? 'black'
  );
};
