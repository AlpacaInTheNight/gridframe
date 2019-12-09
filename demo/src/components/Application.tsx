import * as React from 'react';
import GridFrame from 'GridFrame';
import { MockSimple } from './MockSimple';

interface ApplicationProps {
	
}

interface ApplicationState {
	
}

export default class Application extends React.Component<ApplicationProps, ApplicationState> {

	private config = {
		customStyling: false,
		allowSubGrid: true,
		hidePanel: false
	};

	constructor(props: ApplicationProps) {
		super(props);
	}

	private onGridFrameUpdate = (updation: any) => {
		if(!updation) return;
		console.log(updation);

		/* const {gridTemplateStorage, gridElementsStorage} = this;
		const {template, elements} = updation;

		if(template && template.columns && template.rows && elements) {
			localStorage.setItem(gridTemplateStorage, JSON.stringify(template));
			localStorage.setItem(gridElementsStorage, JSON.stringify(elements));
		} */
	}

	public render() {

		const components = {
			mockSimple: {
				name: "Simple Mock",
				body: MockSimple,
				props: {},
				observe: {
					adaptive: {
						resizeTrackStep: 25
					}
				}
			}
		};

		const template = {
			columns: [1000],
			rows: [1000, 1000]
		};

		const elements = [
			{
				column: {start: 1, end: 2},
				row: {start: 1, end: 2},
				componentId: "mockSimple",
				id: 0,
				props: {}
			},
			{
				column: {start: 1, end: 2},
				row: {start: 2, end: 3},
				componentId: "mockSimple",
				id: 1,
				props: {}
			}
		];

		return (
			<GridFrame
				onGridUpdate={this.onGridFrameUpdate}
				gridId="main"
				components={components}
				template={template}
				elements={elements}
				config={this.config}
			/>
		);
	}
}
