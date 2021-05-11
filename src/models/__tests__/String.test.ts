import { applyTransformations, StringTransform } from '../String'

describe('String', () => {
  test('Identity works', () => {
    const value = "HelloWorld"
    const result = applyTransformations(value, undefined)
    expect(result).toBe("HelloWorld")
  });

  test('To uppercase works', () => {
    const value = "HelloWorld"
    const result = applyTransformations(value, [StringTransform.ToUppercase])
    expect(result).toBe("HELLOWORLD")
  });

  test('To lowercase works', () => {
    const value = "HelloWorld"
    const result = applyTransformations(value, [StringTransform.ToLowercase])
    expect(result).toBe("helloworld")
  });

  test('To snakecase works', () => {
    const value = "HelloWorld"
    const result = applyTransformations(value, [StringTransform.ToSnakecase])
    expect(result).toBe("hello_world")
  });

  test('To camelcase works', () => {
    const value = "Hello-world"
    const result = applyTransformations(value, [StringTransform.ToCamelcase])
    expect(result).toBe("helloWorld")
  });

  test('To kebabcase works', () => {
    const value = "HelloWorld"
    const result = applyTransformations(value, [StringTransform.ToKebabcase])
    expect(result).toBe("hello-world")
  });
});
