import React from 'react';
import Transition from 'react-transition-group/Transition';

class Fade extends React.Component {

  constructor(props) {
    super(props);
    this.defaultStyle = {
      transition: `opacity ${props.duration}ms ease-in-out`,
      opacity: 0,
    };

    this.transitionStyles = {
      entering: { opacity: 0 },
      entered:  { opacity: 1 },
    };
  }

  render() {
    const { in:inProp, duration, children, mountOnEnter, unmountOnExit, exit } = this.props;
    const { defaultStyle, transitionStyles } = this;

    return (
      <Transition in={inProp} timeout={duration} mountOnEnter={mountOnEnter} unmountOnExit={unmountOnExit} exit={exit}>
        {(state) => (
          <div style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}>
            {children}
          </div>
        )}
      </Transition>
    );
  }
}

export default Fade;