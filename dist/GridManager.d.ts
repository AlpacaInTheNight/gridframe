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
    defaultComponent: IGridFrame.defaultComponent | false;
    defaultAdaptiveObserve: IGridFrame.adaptiveObserve;
    flexFactor: TFlexFactor;
    allowGridResize: boolean;
};
declare type Props = {
    components: IGridFrame.gridComponents;
    config: Partial<IGridFrame.gridConfig>;
};
export default class GridManager {
    private static readonly DEFAULT_GRID_ID_PREFIX;
    private _workArea;
    constructor(props: Props);
    get workArea(): TWorkArea;
    checkContainersBreakpoints: () => void;
}
export {};
