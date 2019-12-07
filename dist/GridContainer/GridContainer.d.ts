import * as React from "react";
declare type Props = {
    body: any;
    props: {
        [key: string]: any;
    };
    containerId: number;
    htmlContainerId: string;
    changeComponentId: (elementId: number, componentId: string) => void;
    adaptiveObserve: IGridFrame.adaptiveObserve;
};
declare type State = {
    width: number;
    height: number;
    breakpointName: string | false;
    orientation: IGridFrame.orientation | false;
};
export declare class GridContainer extends React.Component<Props, State> {
    private observer;
    private target;
    constructor(props: Props);
    render(): JSX.Element;
    private processResize;
    private addObserver;
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export {};
