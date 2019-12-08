import * as React from "react";
import { TContextProps } from '../index';

export const GridContext = React.createContext<Partial<TContextProps>>({});
