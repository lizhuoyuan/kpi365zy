/**
 * 选择用户
 * Created by yuanzhou on 17/02.
 */
import React from 'react'
import {
    InteractionManager,
    View,
    Text,
    TextInput,
    Image,
    PanResponder,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import TopBar from '../common/TopBar'
import ImageResource from '../../utils/ImageResource'
import {updatePage, getPeopleRelationship} from '../../actions'
import  * as SizeController from '../../SizeController'
import {handleUrl} from '../../utils/UrlHandle'

let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const Example = {
        orgName: "cat",
        userDeptRelationships: [
            {
                name: "产品部",
                uniqueid: "000001",
                userList: [
                    {deptUniqueid: "000001", uniqueid: "001", avatar: "", sex: "男", name: "Nick", imgHead: ""},
                    {deptUniqueid: "000001", uniqueid: "002", name: "ZR", imgHead: ""},
                    {deptUniqueid: "000001", uniqueid: "003", name: "Mirror", imgHead: ""},
                    {deptUniqueid: "000001", uniqueid: "004", name: "Sunny", imgHead: ""}
                ]
            },
            {
                name: "市场部", uniqueid: "000002", userList: [
                {deptUniqueid: "000002", uniqueid: "005", name: "许远周233", imgHead: ""},
                {deptUniqueid: "000002", uniqueid: "006", name: "Judy", imgHead: ""},
                {deptUniqueid: "000002", uniqueid: "007", name: "Lynn", imgHead: ""},
                {deptUniqueid: "000002", uniqueid: "008", name: "J1", imgHead: ""},
                {deptUniqueid: "000002", uniqueid: "009", name: "J2", imgHead: ""},
                {deptUniqueid: "000002", uniqueid: "010", name: "J3", imgHead: ""}
            ]
            }
        ]
    }
    ;
/**
 * 移除数组
 * @param array
 * @param uniqueid
 * @param key
 * @returns {Array}
 */
function removeToArray(array, uniqueid, key) {
    let tempArray = [];
    let index = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] != uniqueid) {
            tempArray[index] = array[i];
            index++;
        }
    }
    return tempArray;
}
/**
 * 更新数组
 * @param array
 * @param obj
 * @param key
 * @param objKey
 * @returns {*}
 */
function updateToArray(array, obj, key, objKey) {
    let isExist = false;
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === obj[objKey]) {
            array[i] = obj;
            isExist = true;
            break;
        }
    }
    if (!isExist) {
        array.push(obj);
    }
    return array;
}
/**
 * 判断是否存在该对象
 * @param array
 * @param value
 * @param key
 * @returns {boolean}
 */
function isExistToArray(array, value, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return true;
        }
    }
    return false;
}
/**
 * 搜索查值
 * @param array
 * @param value
 * @param key
 * @returns {Array}
 */
function findToArray(array, value, key) {
    let tempArray = [];
    for (let i = 0; i < array.length; i++) {
        let obj = array[i];
        if (obj[key].indexOf(value) != -1) {
            tempArray.push(obj);
        }
    }
    return tempArray;
}
/**
 * 查找对象
 * @param array
 * @param name
 * @param key
 * @returns {*}
 */
function findObjToArray(array, name, key) {
    for (let i = 0; i < array.length; i++) {
        let obj2 = array[i];
        if (obj2[key] === name) {
            return obj2;
        }
    }
    return null;
}
/**
 *    人员选项
 */
const UserItem = React.createClass({
    getInitialState() {
        return {
            isChoose: false,
            isFirstInit: true,
        }
    },
    getDefaultProps() {
        return {
            itemStyle: {}
        }
    },
    chooseUser(){
        let {rowData, isChoose} = this.props;
        if (isChoose) {
            this.props.chooseUserData && this.props.chooseUserData(rowData, "remove");
        } else {
            this.props.chooseUserData && this.props.chooseUserData(rowData, "add");
        }
    },
    render(){
        let {rowData, isChoose} = this.props;
        let chooseSource = ImageResource["choose@2x.png"];
        if (isChoose) {
            chooseSource = ImageResource["choose2@2x.png"];
        }
        let avatar = {uri: "http"};
        let url = handleUrl(rowData.avatar);
        if (url) {
            avatar = {uri: url};
        } else {
            if (rowData.sex == "男") {
                avatar = ImageResource["header-boy@2x.png"];
            } else if (rowData.sex == "女") {
                avatar = ImageResource["header-girl@2x.png"];
            }
        }
        return (
            <View style={[styles.userContainer,this.props.itemStyle]}>
                <TouchableOpacity activeOpacity={0.8} onPress={this.chooseUser}>
                    <View style={styles.rowView}>
                        <View style={styles.userImageView}>
                            <Image source={chooseSource} style={styles.imageCircleBtnImage}/>
                        </View>
                        <View style={styles.userImageViewNoRight}>
                            <View style={styles.bigAvatarView}>
                                <Image source={avatar} style={styles.bigAvatar}/>
                            </View>
                        </View>
                        <View style={styles.bigNameTextView}>
                            <Text style={styles.bigNameText}>{rowData.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
});

/**
 *    部门选项
 */
const DeptItem = React.createClass({
    getInitialState() {
        return {
            chooseAll: false,
            showAll: false,
        }
    },
    userUniqueidArray: [],
    componentDidMount(){
        let {rowData, chooseDept} = this.props;
        let chooseAll = false;
        if (chooseDept) {
            this.userUniqueidArray = chooseDept.userList;
            //判断是否全选用户
            if (chooseDept.userList.length === rowData.userList.length) {
                chooseAll = true;
            } else {
                chooseAll = false;
            }
        }
        this.setState({
            chooseAll: chooseAll
        });
    },
    componentWillReceiveProps(nextProps){
        let {rowData, chooseDept} = nextProps;
        if (chooseDept) {
            this.userUniqueidArray = chooseDept.userList;
            //判断是否全选用户
            if (chooseDept.userList.length === rowData.userList.length) {
                if (!this.state.chooseAll) {
                    this.setState({
                        chooseAll: true
                    });
                }
            }else{
                this.setState({
                    chooseAll: false
                });
            }
        }else{
            this.setState({
                chooseAll: false
            });
        }
    },
    chooseAll(){
        let {rowData, deptKey} = this.props;
        if (this.state.chooseAll && this.userUniqueidArray.length == rowData.userList.length) {
            this.userUniqueidArray = [];
            this.setState({chooseAll: false, showAll: true});
            this.props.chooseDeptAndUser && this.props.chooseDeptAndUser({
                [deptKey]: rowData[deptKey],
                name: rowData.name,
                userList: []
            }, "deptRemove");
        } else {
            this.userUniqueidArray = rowData.userList.map(function (obj) {
                return obj;
            });
            this.setState({chooseAll: true, showAll: true});
            this.props.chooseDeptAndUser && this.props.chooseDeptAndUser({
                [deptKey]: rowData[deptKey],
                name: rowData.name,
                userList: this.userUniqueidArray
            }, "deptAdd");

        }


    },
    showAll(){
        this.setState({showAll: !this.state.showAll});
    },
    chooseUserData(data, type){
        let {rowData, deptKey, userKey} = this.props;
        //this.userUniqueidArray = [];
        if (type == "add") {
            this.userUniqueidArray.push(data);
            if (this.userUniqueidArray.length == rowData.userList.length) {
                this.setState({chooseAll: true});
                this.props.chooseDeptAndUser && this.props.chooseDeptAndUser({
                    [deptKey]: rowData[deptKey],
                    name: rowData.name,
                    userList: this.userUniqueidArray
                }, type, data);
            } else {
                this.setState({chooseAll: false});
                this.props.chooseDeptAndUser && this.props.chooseDeptAndUser({
                    [deptKey]: rowData[deptKey],
                    name: rowData.name,
                    userList: this.userUniqueidArray
                }, type, data);

            }
        } else {
            let userUniqueidArray = removeToArray(this.userUniqueidArray, data[userKey], userKey);
            this.setState({chooseAll: false, userUniqueidArray: userUniqueidArray});
            this.props.chooseDeptAndUser && this.props.chooseDeptAndUser({
                [deptKey]: rowData[deptKey],
                name: rowData.name,
                userList: userUniqueidArray
            }, type, data);
        }

    },

    render(){
        let {rowData, chooseDept, userKey} = this.props;
        let chooseAll = this.state.chooseAll;
        this.userUniqueidArray = [];
        if (chooseDept !== null) {
            this.userUniqueidArray = chooseDept.userList;
        }
        let chooseAllSource = ImageResource["choose@2x.png"];
        if (chooseAll) {
            chooseAllSource = ImageResource["choose2@2x.png"];
        }
        let showAllSource = ImageResource["arrow-down@2x.png"];
        if (this.state.showAll) {
            showAllSource = ImageResource["arrow-up@2x.png"];
        }
        let peopleItems = [];
        if (this.state.showAll) {
            for (let i = 0; i < rowData.userList.length; i++) {
                let obj = rowData.userList[i];
                let isChoose = false;
                if (isExistToArray(this.userUniqueidArray, obj[userKey], userKey)) {
                    isChoose = true;
                }
                peopleItems[i] =
                    <UserItem
                        itemStyle={{marginLeft:0}}
                        isChoose={isChoose}
                        chooseUserData={this.chooseUserData}
                        rowData={obj}
                        key={i}
                    />
            }

        }

        return (
            <View style={styles.deptContainer}>
                <View style={styles.deptTopContainer}>
                    <TouchableOpacity onPress={this.chooseAll}>
                        <View style={styles.deptTopRowView}>
                            <View style={styles.deptTopRowViewLeft}>
                                <View style={styles.imageCircleBtnView}>
                                    <Image source={chooseAllSource}
                                           style={styles.imageCircleBtnImage}
                                    />
                                </View>
                            </View>
                            <View style={styles.deptTopRowViewRight}>
                                <Text style={styles.deptText}>{rowData.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.showAll} style={styles.deptTopRightBtn}>
                        <Image
                            source={showAllSource}
                            style={styles.imageCircleBtnImage}
                        />
                    </TouchableOpacity>
                </View>
                {peopleItems}
            </View>
        )
    }
});

/**
 *    人员选择
 */
const ChooseUser = React.createClass({
    getInitialState() {
        return {
            deptAndUserArray: [], //选择的组和用户
            searchUserArray: [], //查询的用户
            useModel: 0,
            showSearchUserModel: false,
            chooseUserArray: []  //选择的用户

        }
    },
    getDefaultProps(){
        return {
            userKey: "userUniqueid",//"userUniqueid",
            deptKey: "deptUniqueid",//"deptUniqueid",
            userDeptKey: "deptUniqueid",
            showTopBar: true,
            chooseType: "deptAndUser",
            seletedUsers: null,
        }
    },
    userArray: [],//所有用户
    chooseUserDistance: 0,
    searchResultsCanShowSize: 0,
    keyboardDidShowListener: null,
    keyboardDidHideListener: null,

    toback(){
        if (this.props.toBack) {
            this.props.toBack();
        } else {
            this.props.navigator.pop();
        }
    },
    onChangeText(text){
        if (text.length > 0) {
            let tempArray = findToArray(this.userArray, text, "name");
            this.setState({searchUserArray: tempArray});
        } else {
            this.setState({searchUserArray: []});
        }
    },
    componentWillReceiveProps(nextProps){
        let {seletedUsers, pageModel, chooseType} = nextProps;
        let {PageData} = pageModel;
        if (chooseType === "deptAndUser") {
            this.userDeptRelationships = PageData.userDeptRelationships;
        } else {
            if (PageData.orgnizationUsers && PageData.orgnizationUsers.length > 0) {
                this.userDeptRelationships = PageData.orgnizationUsers;
                if (seletedUsers) {
                    this.initSelectedUser();
                }
            }
        }

        if (this.chooseUserDistance > 0) {
            this.refs.searchResultsScroll.scrollTo({x: this.chooseUserDistance * 37 - 3, y: 0, animated: false});
        }
    },
    componentWillMount(){
        this.subscriptions = [
            Keyboard.addListener('keyboardWillShow', this._keyboardDidShow),
            Keyboard.addListener('keyboardWillHide', this._keyboardDidHide)];
    },
    componentDidMount(){
        let {chooseType, pageModel, seletedUsers} = this.props;
        let PageData = pageModel.PageData;
        let postData = {};
        if (chooseType === "deptAndUser") {
            postData = {
                token: PageData.token,
                userUniqueid: PageData.userUniqueid,
                orgUniqueid: PageData.orgUniqueid,
                type: "all"
            };
            InteractionManager.runAfterInteractions(() => {
                getPeopleRelationship(this.props.dispatch, postData);
            });
        } else {
            if (PageData.orgnizationUsers && PageData.orgnizationUsers.length > 0) {
                this.userDeptRelationships = PageData.orgnizationUsers;
                if (seletedUsers.length > 0) {
                    this.initSelectedUser();
                }
            } else {
                postData = {
                    token: PageData.token,
                    userUniqueid: PageData.userUniqueid,
                    orgUniqueid: PageData.orgUniqueid,
                };
                InteractionManager.runAfterInteractions(() => {
                    getPeopleRelationship(this.props.dispatch, postData);
                });
            }
        }


    },
    componentWillUnount(){
        this.subscriptions.forEach((sub) => sub.remove())
    },
    _keyboardDidShow(){

    },
    _keyboardDidHide(){

    },
    /**
     * 选择部门及人员
     */
    chooseDeptAndUser(dept, type, userObj){
        let {userKey, deptKey, userDeptKey}  = this.props;
        let chooseUserArray = [...this.state.chooseUserArray];
        let deptAndUserArray = [...this.state.deptAndUserArray];
        if (type == "add") {
            chooseUserArray = updateToArray(chooseUserArray, userObj, userKey, userKey);
        } else if (type == "remove") {
            chooseUserArray = removeToArray(chooseUserArray, userObj[userKey], userKey);
        } else if (type == "deptAdd") {
            dept.userList.forEach(function (obj, index) {
                chooseUserArray = updateToArray(chooseUserArray, obj, userKey, userKey);
            });
        } else if (type == "deptRemove") {
            chooseUserArray = removeToArray(chooseUserArray, dept[deptKey], userDeptKey);

        }
        if (deptAndUserArray.length == 0) {
            deptAndUserArray.push(dept);
        } else {
            deptAndUserArray = updateToArray(deptAndUserArray, dept, deptKey, deptKey);
        }
        this.setState({
            deptAndUserArray: deptAndUserArray,
            chooseUserArray: chooseUserArray
        });
    },
    /**
     * 初始化选中人员
     */
    initSelectedUser(){
        let {userKey, deptKey, userDeptKey, seletedUsers}  = this.props;
        let chooseUserArray = seletedUsers;
        let message = "";
        //添加指定的用户到部门用户列表中
        let deptAndUserArray = [];
        seletedUsers.forEach((obj) => {
            let deptAndUserObj = findObjToArray(deptAndUserArray, obj[userDeptKey], deptKey);
            if (deptAndUserObj) {
                let isExist = false;
                for (let i = 0; i < deptAndUserObj.userList.length; i++) {
                    let temp = deptAndUserObj.userList[i];
                    if (temp[userKey] == obj[userKey]) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    deptAndUserObj.userList.push(obj);
                }
                if (deptAndUserArray.length == 0) {
                    deptAndUserArray.push(deptAndUserObj);
                } else {
                    deptAndUserArray = updateToArray(deptAndUserArray, deptAndUserObj, deptKey, deptKey);
                }
            } else {
                let deptObj = {};
                if (this.userDeptRelationships) {
                    for (let i = 0; i < this.userDeptRelationships.length; i++) {
                        let temp = this.userDeptRelationships[i];
                        if (temp[deptKey] === obj[userDeptKey]) {
                            Object.assign(deptObj, temp);
                            deptObj.userList = [];
                            deptObj.userList.push(obj);
                            break;
                        }
                    }

                }

                if (deptAndUserArray.length == 0) {
                    deptAndUserArray.push(deptObj);
                } else {
                    deptAndUserArray = updateToArray(deptAndUserArray, deptObj, deptKey, deptKey);
                }
            }
        }, this);
        this.setState({
            searchUserArray: [],
            chooseUserArray: chooseUserArray,
            deptAndUserArray: deptAndUserArray
        });
    },
    /**
     * 选择人员
     */
    chooseSearchUser(obj){
        let {userKey, deptKey, userDeptKey}  = this.props;
        //添加指定用户到选中用户列表中
        let chooseUserArray = updateToArray(this.state.chooseUserArray, obj, userKey, userKey);
        //添加指定的用户到部门用户列表中
        let deptAndUserArray = this.state.deptAndUserArray;
        let deptAndUserObj = findObjToArray(this.state.deptAndUserArray, obj[userDeptKey], deptKey);
        if (deptAndUserObj) {
            let isExist = false;
            for (let i = 0; i < deptAndUserObj.userList.length; i++) {
                let temp = deptAndUserObj.userList[i];
                if (temp[userKey] == obj[userKey]) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                deptAndUserObj.userList.push(obj);
            }
            if (deptAndUserArray.length == 0) {
                deptAndUserArray.push(deptAndUserObj);
            } else {
                deptAndUserArray = updateToArray(deptAndUserArray, deptAndUserObj, deptKey, deptKey);
            }
        } else {
            let deptObj = {};
            if (this.userDeptRelationships) {
                for (let i = 0; i < this.userDeptRelationships.length; i++) {
                    let temp = this.userDeptRelationships[i];
                    if (temp[deptKey] === obj[userDeptKey]) {
                        Object.assign(deptObj, temp);
                        deptObj.userList = [];
                        deptObj.userList.push(obj);
                        break;
                    }
                }

            }
            if (deptAndUserArray.length == 0) {
                deptAndUserArray.push(deptObj);
            } else {
                deptAndUserArray = updateToArray(deptAndUserArray, deptObj, deptKey, deptKey);
            }
        }
        this.refs.searchInput.clear();
        this.setState({
            searchUserArray: [],
            chooseUserArray: chooseUserArray,
            deptAndUserArray: deptAndUserArray
        });

    },
    _searchInputOnFocus(){
        this.setState({showSearchUserModel: true});
    },
    /**
     * 移除选中人员
     */
    removeChooseUser(obj){
        let {userKey, deptKey, userDeptKey}  = this.props;
        //从用户选中列表中移除指定用户
        let chooseUserArray = removeToArray(this.state.chooseUserArray, obj[userKey], userKey);
        //从部门用户列表中移除指定的用户
        let deptAndUserObj = findObjToArray(this.state.deptAndUserArray, obj[userDeptKey], deptKey);
        let deptAndUserArray = this.state.deptAndUserArray;
        if (deptAndUserObj) {
            deptAndUserObj.userList = removeToArray(deptAndUserObj.userList, obj[userKey], userKey);
            if (deptAndUserArray.length > 0) {
                deptAndUserArray = updateToArray(this.state.deptAndUserArray, deptAndUserObj, deptKey, deptKey);
            }
        }
        this.setState({deptAndUserArray: deptAndUserArray, chooseUserArray: chooseUserArray});
    },
    _onPanResponderGrant(e, gestureState) {
        this.setState({showSearchUserModel: false});
        this.refs.searchInput.clear();
        this.refs.searchInput.blur();
        this.state.searchUserArray = [];
    },
    searchResultsScrollEnded(event){
        const position = event.nativeEvent.contentOffset.x;
        this.refs.searchResultsScroll.scrollTo({x: position, animated: true});
    },
    /**
     * 确认
     */
    ensureSubmit(){
        if (this.props.ensureSubmit) {
            this.props.ensureSubmit(this.state.chooseUserArray);
        } else {
            let obj = {
                route: null,
                toBack: true,
                needInitUpdate: 0,

            }
            objUpdate = {
                userRelationships: this.state.chooseUserArray,
            }
            updatePage(this.props.dispatch, obj, this.props.actionType, objUpdate);
        }
    },
    /**
     * 全选
     */
    selectAllSubmit(){
        if (this.props.selectAllSubmit) {
            this.props.selectAllSubmit(this.userArray);
        } else {
            let obj = {
                route: null,
                toBack: true,
                needInitUpdate: 0,

            }
            objUpdate = {
                userRelationships: this.userArray,
            }
            updatePage(this.props.dispatch, obj, this.props.actionType, objUpdate);
        }
    },
    render(){
        let {pageModel, chooseType} = this.props;
        let PageData = pageModel.PageData;
        let {userKey, deptKey, userDeptKey}  = this.props;
        let width = deviceWidth;
        let deptItems = [];
        this.userArray = [];
        if (this.userDeptRelationships) {
            for (let i = 0; i < this.userDeptRelationships.length; i++) {
                let obj = this.userDeptRelationships[i];
                //将所有用户存储在userArray中
                for (let j = 0; j < obj.userList.length; j++) {
                    let obj2 = obj.userList[j];
                    this.userArray.push(obj2);
                }
                //寻找选中的部门用户对象
                let deptObj = findObjToArray(this.state.deptAndUserArray, obj[deptKey], deptKey);
                if (obj.userList.length > 0) {
                    deptItems[i] =
                        <DeptItem chooseDept={deptObj}
                                  chooseDeptAndUser={this.chooseDeptAndUser}
                                  rowData={obj}
                                  key={i}
                                  userKey={userKey}
                                  deptKey={deptKey}
                                  userDeptKey={userDeptKey}
                            {...this.props}
                        />
                }
            }
        }


        let searchResults = [];
        let chooseUsers = [];
        //生成查询的用户队列
        if (this.state.searchUserArray.length > 0) {
            for (let i = 0; i < this.state.searchUserArray.length; i++) {
                let obj = this.state.searchUserArray[i];
                let isChoose = false;
                //判断查询的用户是否已被选择
                let deptObj = findObjToArray(this.state.deptAndUserArray, obj[userDeptKey], deptKey);
                if (deptObj && isExistToArray(deptObj.userList, obj[userKey], userKey)) {
                    isChoose = true;
                }
                searchResults[i] =
                    <UserItem
                        isChoose={isChoose}
                        itemStyle={{marginLeft:10*changeRatio,marginRight:10*changeRatio}}
                        chooseUserData={this.chooseSearchUser}
                        rowData={obj}
                        key={i}
                    />
            }
        }
        let tempIndex = 0;
        let searchMarginLeft = 0;
        let searchResultsWidth = 0;
        let searchResultsCanShowSize = Math.floor(((width) / 5 * 3 - 30) / 37);
        this.searchResultsCanShowSize = searchResultsCanShowSize;
        let that = this;
        //渲染选中的用户列表
        this.state.chooseUserArray.forEach(function (obj, index) {
            let name = obj.name;
            let temp = null;
            let marginLeft = 3;
            if (tempIndex == 0) {
                marginLeft = 0;
            }
            let url = handleUrl(obj.avatar);
            if (url) {
                let avatar = {uri: url};
                temp = <View key={tempIndex}
                             style={{height:38*changeRatio,justifyContent:"center"}}
                >
                    <TouchableOpacity
                        onPress={()=>that.removeChooseUser(obj)}
                        style={{justifyContent:"center",alignItems:"center",height:32*changeRatio,backgroundColor:"#c3c3c3",width:32*changeRatio,borderWidth:1,borderColor:"#c3c3c3",marginRight:3*changeRatio}}
                        key={tempIndex}>
                        <Image
                            source={avatar}
                            style={{height:32*changeRatio,width:32*changeRatio}}>

                        </Image>
                    </TouchableOpacity>
                </View>
            } else {
                temp = <View
                    key={tempIndex}
                    style={{height:38*changeRatio,justifyContent:"center"}}
                >
                    <TouchableOpacity
                        onPress={()=>that.removeChooseUser(obj)}
                        style={{justifyContent:"center",alignItems:"center",height:32*changeRatio,borderRadius:0,backgroundColor:"rgb(29,169,252)",width:32*changeRatio,borderWidth:1,borderColor:"rgb(29,169,252)",marginRight:3*changeRatio}}
                        key={tempIndex}>
                        <Text numberOfLines={2} style={{color:"#ffffff",textAlign:"center", fontSize:10}}>{name}</Text>
                    </TouchableOpacity>
                </View>
            }
            chooseUsers.push(temp);
            tempIndex++;
            searchMarginLeft += 37;
            searchResultsWidth += 37;
        });

        //判断选择的用户需偏移的距离
        this.chooseUserDistance = 0;
        if (tempIndex > searchResultsCanShowSize) {
            this.chooseUserDistance = tempIndex - searchResultsCanShowSize;
        }

        if (searchMarginLeft > (searchResultsCanShowSize * 37 - 3)) {
            searchResultsWidth = (searchResultsCanShowSize * 37 - 3 - 10) * changeRatio;
            searchMarginLeft = (searchResultsCanShowSize * 37 - 3 - 10) * changeRatio;
        } else if (searchMarginLeft < 37) {
            searchMarginLeft = 0;
        }

        let watcher = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => this._onPanResponderGrant(evt, gestureState)
        });
        return (
            <View style={[styles.container,{zIndex:this.state.showSearchUserModel?0:400}]}>
                {this.props.showTopBar &&
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    showRightImage={true}
                    topBarText="人员筛选"
                    showRight={false}
                    showLeft={true}
                />
                }
                <View style={[this.props.layoutStyle,styles.btnView]}>
                    <TouchableOpacity style={styles.btnAbsolute} onPress={this.selectAllSubmit}>
                        <Text style={[styles.buttonText,{color:"rgb(29,169,252)"}]}>全选</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnAbsolute2} onPress={this.ensureSubmit}>
                        <Text style={styles.buttonText}>确定</Text>
                    </TouchableOpacity>

                </View>
                <View style={[this.props.showTopBar?{marginTop:topHeight+8*changeRatio}:{marginTop:8*changeRatio}]}>
                    <View style={styles.searchView}>
                        <View style={styles.searchImageView}>
                            <Image
                                style={styles.searchImage}
                                source={ImageResource["searchbar-list@2x.png"]}
                            />
                        </View>
                        <View style={[styles.searchImageView,{marginLeft: searchMarginLeft+15}]}>
                            <Image
                                style={styles.searchImage}
                                source={ImageResource["searchbar-search@2x.png"]}
                            />
                        </View>
                        <TextInput onSubmitEditing={Keyboard.dismiss}
                                   textAlignVertical={"center"}
                                   ref={"searchInput"}
                                   onFocus={this._searchInputOnFocus}
                                   onChangeText={this.onChangeText}
                                   placeholder={'搜索'}
                                   underlineColorAndroid={'transparent'}
                                   style={[styles.textInputFlex,styles.searchTextInput]}>
                        </TextInput>
                        <View style={{justifyContent:"center",height:38,width:22,position:"absolute",right:8}}>
                            <Image
                                style={styles.searchImage}
                                source={ImageResource["searchbar-reload@2x.png"]}
                            />
                        </View>
                        <View style={{width:searchResultsWidth,position:"absolute",left:38,top:0,zIndex:500}}>
                            <ScrollView
                                ref={"searchResultsScroll"}
                                horizontal
                                scrollEnabled
                                removeClippedSubviews
                                scrollEventThrottle={1000}
                                showsHorizontalScrollIndicator={false}
                                automaticallyAdjustContentInsets
                            >
                                {chooseUsers}
                            </ScrollView>
                        </View>
                    </View>

                </View>
                <View  {...watcher.panHandlers}
                    style={[styles.searchUserModelView,this.state.showSearchUserModel?{zIndex:666}:{zIndex:0,left:-2*deviceWidth}]}
                >
                    <ScrollView showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps={"always"}
                                keyboardDismissMode='interactive'
                    >
                        {searchResults}
                    </ScrollView>
                </View>
                <ScrollView showsVerticalScrollIndicator={true}
                            keyboardShouldPersisTaps={true}
                            keyboardDismissMode='interactive'
                            ref={"scrollView"}
                            contentContainerStyle={styles.contentContainer}
                >
                    <View style={styles.orgNameTextView}>
                        <Text style={styles.orgNameText}>{PageData.orgName}</Text>
                    </View>
                    {deptItems}
                </ScrollView>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //padding:10,
        backgroundColor: "rgb(248,248,248)"
    },
    contentContainer: {
        paddingBottom: 125,
        //padding:10,
        paddingTop: 0,
    },
    textInputFlex: {
        flex: 1,
        color: "#ffffff"
    },
    buttonText: {
        color: 'rgb(255,255,255)',
        fontSize: 15 * changeRatio,
        //fontWeight:"400"
    },
    btnView: {
        flex: 1,

        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        //justifyContent:"center",
        height: 49 * changeRatio,
        zIndex: 500,
    },
    btnAbsolute: {
        marginTop: 9.5 * changeRatio,
        marginBottom: 9.5 * changeRatio,
        flex: 0,
        width: 100 * changeRatio,
        borderRadius: 8 * changeRatio,
        borderColor: 'rgb(29,169,252)',
        // backgroundColor:"rgb(29,169,252)",
        borderWidth: 1,
        //padding:10,
        height: 30 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8 * changeRatio
    },
    btnAbsolute2: {
        marginTop: 9.5 * changeRatio,
        marginBottom: 9.5 * changeRatio,
        position: "absolute",
        right: 8 * changeRatio,
        borderRadius: 8 * changeRatio,
        backgroundColor: "rgb(29,169,252)",
        height: 30 * changeRatio,
        width: 100 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deptContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderBottomColor: "rgb(229,229,229)",
        borderBottomWidth: 1
    },
    deptTopContainer: {
        flexDirection: "row",
        height: 46 * changeRatio,
        paddingLeft: 8 * changeRatio,
        flex: 1,
        marginTop: 0
    },
    deptTopRowView: {
        flexDirection: "row",
        flex: 1
    },
    deptTopRowViewLeft: {
        justifyContent: "center",
        height: 46 * changeRatio,
        marginRight: 10 * changeRatio
    },
    deptTopRowViewRight: {
        flex: 0,
        justifyContent: "center",
        height: 46 * changeRatio
    },
    imageCircleBtnImage: {
        height: 22 * changeRatio,
        width: 22 * changeRatio
    },

    imageCircleBtnView: {
        height: 22 * changeRatio,
        width: 22 * changeRatio
    },
    deptText: {
        fontSize: 15 * changeRatio,
        color: "#5d6d81"
    },
    deptTopRightBtn: {
        justifyContent: "center",
        position: "absolute",
        right: 8 * changeRatio,
        width: 46 * changeRatio,
        height: 46 * changeRatio,
        alignItems: "flex-end",
        flex: 1,
        marginRight: 10 * changeRatio
    },
    userContainer: {
        flexDirection: "row",
        flex: 0,
        borderTopColor: "rgb(229,229,229)",
        backgroundColor: "#ffffff",
        height: 46 * changeRatio,
        paddingLeft: 8 * changeRatio,
        borderTopWidth: 1
    },
    bigAvatar: {
        height: 32 * changeRatio,
        width: 32 * changeRatio
    },
    bigAvatarView: {
        justifyContent: "center",
        height: 32 * changeRatio,
        marginRight: 10 * changeRatio,
        backgroundColor: "#cccccc",
        width: 32 * changeRatio
    },
    bigNameText: {
        fontSize: 15 * changeRatio,
        color: "#2b3d54"
    },
    bigNameTextView: {
        flex: 0,
        justifyContent: "center",
        height: 46 * changeRatio
    },
    userImageView: {
        justifyContent: "center",
        height: 46 * changeRatio,
        marginRight: 10 * changeRatio
    },
    userImageViewNoRight: {
        justifyContent: "center",
        height: 46 * changeRatio
    },
    rowView: {
        flexDirection: "row",
        flex: 1
    },
    orgNameTextView: {
        justifyContent: "center",
        paddingLeft: 8 * changeRatio,
        marginTop: 8 * changeRatio,
        borderColor: "rgb(229,229,229)",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 49 * changeRatio
    },
    orgNameText: {
        fontSize: 16 * changeRatio,
        color: "#5d6181"
    },
    searchUserModelView: {
        position: "absolute",
        zIndex: 600,
        top: 130 * changeRatio,
        left: 0,
        backgroundColor: "rgba(255,255,255,0.9)",
        width: deviceWidth,
        height: deviceHeight
    },
    searchTextInput: {
        color: "rgb(180,180,182)",
        marginRight: 22 * changeRatio,
        fontSize: 14 * changeRatio,
        zIndex: 600
    },
    searchImage: {
        height: 22 * changeRatio,
        width: 22 * changeRatio
    },
    searchImageView: {
        justifyContent: "center",
        height: 38 * changeRatio,
        left: 0,
        width: 22 * changeRatio,
    },
    searchView: {
        flex: 0,
        alignItems: "center",
        marginLeft: 8 * changeRatio,
        marginRight: 8 * changeRatio,
        paddingRight: 8 * changeRatio,
        paddingLeft: 8 * changeRatio,
        height: 38 * changeRatio,
        backgroundColor: "rgb(226,226,228)",
        flexDirection: "row",
        borderRadius: 8 * changeRatio,
        justifyContent: "center"
    }

});

export default ChooseUser