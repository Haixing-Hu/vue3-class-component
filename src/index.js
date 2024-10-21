////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// The following polyfill is required to support the decorator metadata proposal.
// see:
// [1] https://github.com/babel/babel/issues/16838
// [2] https://github.com/babel/website/blob/26139b82ac19e258c806db3de4f33844bd0abda1/docs/plugin-proposal-decorators.md#note-on-symbolmetadata
import 'core-js/proposals/decorator-metadata-v2.js';
import Component from './component';
import createDecorator from './create-decorator';
import Inject from './inject';
import Prop from './prop';
import Provide from './provide';
import Raw from './raw';
import toVue from './to-vue';
import VModel from './v-model';
import Watch from './watch';

export {
  Component,
  createDecorator,
  Inject,
  Prop,
  Provide,
  Raw,
  toVue,
  VModel,
  Watch,
};
