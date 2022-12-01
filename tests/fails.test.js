function sum(a, b) {
  return a + b
}

test('adds 1 + 2 to equal 4 should fail', () => {
  expect(sum(1, 2)).toBe(4)
})
