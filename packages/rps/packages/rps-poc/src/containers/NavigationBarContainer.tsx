import { connect } from 'react-redux';

import NavigationBar from '../components/NavigationBar';
import * as loginActions from '../redux/login/actions';
import * as globalActions from '../redux/global/actions';

import { SiteState } from '../redux/reducer';

const mapStateToProps = (state: SiteState) => ({
  showRules: state.rules.visible,
  loginDisplayName: state.login.user.displayName,
});

const mapDispatchToProps = {
  logoutRequest: loginActions.logoutRequest,
  rulesRequest: globalActions.toggleVisibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationBar);
