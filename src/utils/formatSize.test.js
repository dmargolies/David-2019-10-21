import formatSize from './formatSize';

it('should format sizes below 1kB', () => {
  expect(formatSize(0)).toEqual('0B');
  expect(formatSize(1)).toEqual('1B');
  expect(formatSize(300)).toEqual('300B');
  expect(formatSize(999)).toEqual('999B');
});

it('should format sizes at or above 1kB with 0 decimal places', () => {
  expect(formatSize(1000)).toEqual('1kB');
  expect(formatSize(1158)).toEqual('1kB');
  expect(formatSize(1800)).toEqual('2kB');
  expect(formatSize(3005)).toEqual('3kB');
  expect(formatSize(30999)).toEqual('31kB');
});

it('should format sizes at or above 1MB with 1 decimal place', () => {
  expect(formatSize(1000000)).toEqual('1.0MB');
  expect(formatSize(1999999)).toEqual('2.0MB');
  expect(formatSize(1099999)).toEqual('1.1MB');
});

it('should return 0B for undefined input', () => {
  expect(formatSize()).toEqual('0B');
});
