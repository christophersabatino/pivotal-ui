const React = require('react');
const {DefaultButton} = require('pui-react-buttons');
const {mergeProps} = require('pui-react-helpers');
const {Icon} = require('pui-react-iconography');
const mixin = require('pui-react-mixins');
const Scrim = require('pui-react-mixins/mixins/scrim_mixin');
const Transition = require('pui-react-mixins/mixins/transition_mixin');
const classnames = require('classnames');

require('pui-css-select');

const types = React.PropTypes;

function isBlank(value) {
  return [null, undefined].includes(value);
}

class Select extends mixin(React.Component).with(Scrim, Transition) {
  constructor(props, context) {
    super(props, context);
    const {defaultValue} = props;
    this.state = {
      open: false,
      uncontrolledValue: defaultValue
    };
  }

  static propTypes = {
    defaultValue: types.any,
    name: types.string,
    onChange: types.func,
    onEntered: types.func,
    onExited: types.func,
    options: types.array.isRequired,
    value: types.any
  };

  toggle = () => this.setState({open: !this.state.open});

  select = value => () => {
    this.setState({open: false, uncontrolledValue: value}, this.props.onChange && this.props.onChange(value));
  };

  scrimClick = () => this.setState({open: false});

  render() {
    const {open, uncontrolledValue} = this.state;
    const {value: controlledValue, defaultValue: __IGNORE2, onChange, name, options, onEntered, onExited, ...props} = mergeProps(this.props, {className: ['select', {open}]});
    const toggleValue = isBlank(controlledValue) ? uncontrolledValue : controlledValue;

    const {toggleLabel, selectOptions} = options.reduce((memo, option) => {
      const {value, label} = typeof option === 'object' ? option: {value: option, label: option};
      const selected = value === toggleValue;
      if (selected) memo.toggleLabel = label;
      const className = classnames({selected: value === toggleValue});
      memo.selectOptions.push(<li {...{className, key: value}}><a className="option" role="button" onClick={this.select(value)}>{label}</a></li>);
      return memo;
    }, {toggleLabel: toggleValue, selectOptions: []});
    const list = <ul>{selectOptions}</ul>;

    return (
      <div {...props}>
        <input type="hidden" {...{name, value: toggleValue}}/>
        <DefaultButton type="button" className="select-toggle" onClick={this.toggle}>
          <span className="select-toggle-label">{toggleLabel}</span>
          <Icon src="select_chevrons"/>
        </DefaultButton>
        {list}
        <div className="select-menu">{list}</div>
      </div>
    );
  };
}

module.exports = {Select};