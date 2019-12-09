import * as React from 'react';

interface MockSimpleProps {
	width: number;
}

interface MockSimpleState {
	
}

export class MockSimple extends React.Component<MockSimpleProps, MockSimpleState> {

	public constructor(props: MockSimpleProps) {
		super(props);
	}

	public render() {

		return (
			<div className='mock'>
				I am Simple Mock Component.
			</div>
		);
	}
}
