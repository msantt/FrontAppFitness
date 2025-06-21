// src/utils/dimensoes.js
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const LARGURA = (percentual) => wp(percentual);
export const ALTURA = (percentual) => hp(percentual);
