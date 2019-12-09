import * as React from 'react';
import { TContextProps } from '../index';
interface GridPanelProps {
    elementId: number;
    componentId: string;
}
interface GridPanelState {
}
export declare class GridPanel extends React.Component<GridPanelProps, GridPanelState> {
    static contextType: React.Context<Partial<TContextProps>>;
    context: TContextProps;
    constructor(props: GridPanelProps);
    render(): JSX.Element;
    private onGrabberStart;
    private onJoinerStart;
    private onSwapStart;
    private showOptions;
    private onChangeComponentId;
}
export {};
