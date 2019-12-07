import * as React from 'react';
interface GridPanelProps {
    elementId: number;
    componentId: string;
}
interface GridPanelState {
}
export declare class GridPanel extends React.Component<GridPanelProps, GridPanelState> {
    static contextType: React.Context<Partial<IGridFrame.ContextProps>>;
    context: IGridFrame.ContextProps;
    constructor(props: GridPanelProps);
    render(): JSX.Element;
    private onGrabberStart;
    private onJoinerStart;
    private onSwapStart;
    private showOptions;
    private onChangeComponentId;
}
export {};
