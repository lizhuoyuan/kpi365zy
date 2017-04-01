import {combineReducers} from 'redux'
import loginMsg from './toLoginPage'
import tabManage from './TabManage'
import homePage from './HomePage'
import ShowError from './ShowError'
import PageData from './PageData'
import PageState from './PageState'
import dailyReportInfo from './dailyReportInfo'
import tweets from '../tweet/reducers/tweets'
import appState from '../tweet/reducers/appState'
import draft from '../tweet/reducers/draft'
import routes from '../tweet/reducers/routes'
//import focusTargets from '../tweet/reducers/focusTargets'
import focusTargets from './focusTargets'
import monthCheckInfo from './monthCheckInfo'
import weekEvaluateInfo from './weekEvaluateInfo'
import zhaoxianguan from './zhaoxianguan'
const KpiPage = combineReducers({
    tweets,
    appState,
    draft,
    routes,
    ShowError,
    loginMsg,
    tabManage,
    homePage,
    PageData,
    PageState,
    dailyReportInfo,
    monthCheckInfo,
    weekEvaluateInfo,
    focusTargets,

    zhaoxianguan
})

export default KpiPage
