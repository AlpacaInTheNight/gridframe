declare type Props = {
    components: IGridFrame.gridComponents;
    config: Partial<IGridFrame.gridConfig>;
};
export default class GridManager {
    private static readonly DEFAULT_GRID_ID_PREFIX;
    private _workArea;
    constructor(props: Props);
    get workArea(): IGridFrame.workArea;
    checkContainersBreakpoints: () => void;
}
export {};
