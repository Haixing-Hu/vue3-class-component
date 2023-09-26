/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import buildOptions from "../src/build-options";

/**
 * Unit test of the `buildOptions` function.
 *
 * @author Haixing Hu
 */
describe('buildOptions', () => {
  test('simple test', () => {
    function dec(_, ctx) {
      ctx.metadata.foo = 3;
    }

    Symbol.metadata = Symbol();

    class A {
      @dec
      foo;
    }

    expect(A[Symbol.metadata]).toEqual({ foo: 3 });
    expect(Object.getPrototypeOf(A[Symbol.metadata])).toBe(null);
  });
});
