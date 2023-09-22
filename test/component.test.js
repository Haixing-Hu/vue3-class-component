/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Component } from '../index';

/**
 * Unit test of the `@Component` decorator.
 *
 * @author Haixing Hu
 */
describe('@Component decorator', () => {
  test('simple test', () => {
    @Component
    class Foo {}

    class MyComponent {}
    @Component({
      components: {
        'MyComponent': MyComponent,
      },
    })
    class Bar {}
  });
});
