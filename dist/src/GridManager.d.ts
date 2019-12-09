import { TGridTemplate, TGridConfig, TDefaultComponent, TAdaptiveObserve, TGridComponents } from './index';
export declare type TFlexFactor = {
    col: number;
    row: number;
};
export declare type TWorkArea = {
    gridIdPrefix: string;
    gridAreaId: string;
    gridAreaClassName: string;
    classPrefix: string;
    gridHTMLElements: NodeListOf<HTMLElement> | undefined;
    gridHTMLContainer: HTMLElement | undefined;
    defaultComponent: TDefaultComponent | false;
    defaultAdaptiveObserve: TAdaptiveObserve;
    flexFactor: TFlexFactor;
    allowGridResize: boolean;
};
declare type Props = {
    components: TGridComponents;
    config: Partial<TGridConfig>;
};
export default class GridManager {
    private static readonly DEFAULT_GRID_ID_PREFIX;
    private _workArea;
    constructor(props: Props);
    get workArea(): TWorkArea;
    checkContainersBreakpoints: () => void;
    setContainersActualSizes: (gridTemplate: TGridTemplate) => void;
}
export {};
