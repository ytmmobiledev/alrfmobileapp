import { CommonActions } from "@react-navigation/native";
let _props: any;
export function goPage(props: any, pageName: any, params: any = {}) {
  if (props) _props = props;
  let toPage = CommonActions.reset({
    index: 0,
    routes: [
      {
        name: pageName,
        params: params,
      },
    ],
  });
  _props.navigation.dispatch(toPage);
}
export function restartApp(props: any = null) {
  if (props) _props = props;
  goPage(props, "Startup", {});
}

export function goLogin(props: any = null) {
  if (props) _props = props;
  goPage(_props, "Login", {});
}
