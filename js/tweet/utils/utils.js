/**
 * Created by Jeepeng on 2016/10/6.
 */

'use strict';

import {
  Dimensions,
} from 'react-native';

export default {
  getScreen() {
    return Dimensions.get('window');
  },
};
