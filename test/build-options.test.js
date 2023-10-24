////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import buildOptions from '../src/build-options';

/**
 * Unit tests the `buildOptions()` function.
 *
 * @author Haixing Hu
 */
describe('buildOptions() function', () => {
  class MyClass {}
  test('wrong context argument type', () => {
    expect(() => buildOptions(MyClass, null, {}))
      .toThrowWithMessage(TypeError, 'The context must be an object.');
    expect(() => buildOptions(MyClass, '123', {}))
      .toThrowWithMessage(TypeError, 'The context must be an object.');
  });
  test('wrong options argument type', () => {
    expect(() => buildOptions(MyClass, { kind: 'class' }, null))
      .toThrowWithMessage(TypeError, 'The options of the `@Component` decorator must be an object.');
    expect(() => buildOptions(MyClass, { kind: 'class' }, 'abc'))
      .toThrowWithMessage(TypeError, 'The options of the `@Component` decorator must be an object.');
  });
});
