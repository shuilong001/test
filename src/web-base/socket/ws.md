## 协议请求的使用

- 大部分业务使用的是单次请求，不使用之前监听的方式，改为回调的方式请求

```
// 引入这俩
import { NetPacket } from "@/netBase/NetPacket";
import PKwebsocket from "xxxxx/Ws";

// 这里以获取验证码为例

const refresh_captcha = async () => {
    // 先拿到对应协议
    const req_register_captcha = NetPacket.req_register_captcha();
    // 配置参数
    let id = await getDeviceId()
    req_register_captcha.sign = getRandomSign(id);;
    req_register_captcha.aaa = aaa;
    req_register_captcha.bbb = bbb;
    /*
    * 发送协议
    * 参数1，拿到的协议体
    * 参数2，该协议发送时是否需要登录
    * 参数3，其他参数
    *       callbackName：协议返回的名字
    *       callback：回调函数
    */
    PKwebsocket.instance.send(req_register_captcha, false, {
        callbackName: 'msg_notify_register_captcha', // 这里不用之前那种 xx.xx.msg_notify_register_captcha, 直接字符串就行
        callback: handleCaptchaReceive, // 这里回调函数和之前的一样
    })
};

const handleCaptchaReceive = (captcha: any) => { // 回调函数里拿到返回值自行处理即可
  state.captchaLoading = false
  state.captchaURL = captcha.url;
}
```

- 特殊请求比如一些全局的监听，或者需要多次接收数据的协议，可以用 eventBus 来监听。
  - 使用该方式，组件或页面移除时一定要移除监听，否则会导致内存泄露
  - 如果是自己发起的协议则PKwebsocket.instance.send可以不用传第三个参数
  - eventBus.off 第二个参数是可以指定移除某个监听的

```
// 引入这俩
import { NetPacket } from "@/netBase/NetPacket";
import PKwebsocket from "xxxxx/Ws";
import eventBus from "xxxxx/eventBus";

// 这里以登录为例

// A文件中  如果不传第三个参数 也不影响 B 文件中的监听
const login = () => {
    const req_login = NetPacket.req_login();
    PKwebsocket.instance.send(req_login, false, {
        callbackName: 'msg_nodify_login',
        callback: loginSuccess
    })
}
const loginSuccess = (res:any) => {
    // A文件中登录成功后的逻辑处理
}

// B文件中 全局监听
eventBus.on('msg_nodify_login', loginSuccessCallback)
onBeforeUnmount(() => {
    eventBus.off('msg_nodify_login') // 移除项目所有中登录成功的监听
    // 或者
    eventBus.off('msg_nodify_login', loginSuccessCallback) // 只移除当前这一个监听，不影响其他相同名字的监听
})

const loginSuccessCallback = (res: any) => { // 全局监听 登录成功 后的逻辑处理
    if (res.code == 1) {
        // 登录服务器
        syncLoginStatusFromServe()
    }
}
```

## 全局状态的调整

**这里目的是保证数据来源的同一入口，都从store里拿**
**之前需要调整的代码这里不一定都列出来完了**

### 现在的数据状态

- ws和登录状态
  - systemStore.isWsConnected 判断ws是否已经连接成功，业务上应该用不到
  - systemStore.isServerLoggedIn 判断是否已经同步了服务器的登录状态，业务上应该用不到
  - userStore.isLocalLoggedIn 判断本地是否登录，业务上用这个字段来判断
- 用户数据
  - userStore.token 登录后存下来的token
  - userStore.userInfo 用户信息

```
import { SystemStore } from "@/store/system"
import { User } from "@/store/user"

const systemStore = SystemStore()
const userStore = User()
```

### 之前需要调整的数据状态（不完全归纳）

- isLocalLoggedIn 需要替换为 userStore.isLocalLoggedIn
- Local.get('user') 需要替换为 userStore.userInfo
- Local.get('user').token 或 Local.get('token') 需要替换为 userStore.token
