import * as React from "react";
import { TAdaptiveObserve, TOrientation } from '../index';
declare type Props = {
    body: any;
    props: {
        [key: string]: any;
    };
    containerId: number;
    htmlContainerId: string;
    changeComponentId: (elementId: number, componentId: string) => void;
    adaptiveObserve: TAdaptiveObserve;
};
declare type State = {
    width: number;
    height: number;
    breakpointName: string | false;
    orientation: TOrientation | false;
};
export declare class GridContainer extends React.Component<Props, State> {
    private observer;
    private target;
    constructor(props: Props);
    render(): JSX.Element;
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private processResize;
    private addObserver;
}
export {};
