export enum StringTransform {
  ToUppercase,
  ToLowercase,
  ToSnakecase,
  ToCamelcase,
  ToKebabcase,
}

function applySingleTransformation(value: string, transformation: StringTransform): string {
  switch (transformation) {
    case StringTransform.ToUppercase: {
      return value.toUpperCase();
    }
    case StringTransform.ToLowercase: {
      return value.toLowerCase();
    }
    case StringTransform.ToSnakecase: {
      return value.replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_');
    }
    case StringTransform.ToCamelcase: {
      return value.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    }
    case StringTransform.ToKebabcase: {
      return value.replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-');
    }
  }
}

export function applyTransformations(value: string, transformations: Array<StringTransform> | undefined): string {
  if (!transformations) {
    return value;
  }

  let result = value;

  for (const transformation of transformations) {
    result = applySingleTransformation(result, transformation)
  }

  return result;
}
