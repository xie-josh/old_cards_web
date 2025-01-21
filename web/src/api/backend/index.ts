import createAxios from '/@/utils/axios'
import { useAdminInfo } from '/@/stores/adminInfo'

export const url = '/admin/Index/'

export function index() {
    return createAxios({
        url: url + 'index',
        method: 'get',
    })
}

export function login(method: 'get' | 'post', params: object = {}) {
    return createAxios({
        url: url + 'login',
        data: params,
        method: method,
    })
}

export function logout() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + 'logout',
        method: 'POST',
        data: {
            refreshToken: adminInfo.getToken('refresh'),
        },
    })
}

// export function admin(data: anyObj) {
//     return createAxios({
//         url: `/admin/auth.Admin/channel`,
//         method: 'get',
//         data: data,
//     })
// }



export function getCardBinApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/cardBin`,
        method: 'get',
    })
}

export function getAccountAuditApi(data: anyObj) {
    return createAxios({
        url: `/admin/Account/audit`,
        method: 'post',
        data: data,
    })
}

export function openCardApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/openCard`,
        method: 'post',
        data: data,
    })
}


export function rechargeApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/recharge`,
        method: 'post',
        data: data,
    })
}


export function cancelCardApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/cancelCard`,
        method: 'post',
        data: data,
    })
}


export function cardIndexApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/index`,
        method: 'get',
    })
}

export function accountSingleApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/accountSingle`,
        method: 'get',
        params: data,
    })
}

export function cardInfoApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/cardInfo`,
        method: 'get',
        params: data,
    })
}

export function cardsTransactionsApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/cardsTransactions`,
        method: 'get',
        params: data,
    })
}

export function cardFreezeApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/cardFreeze`,
        method: 'post',
        data: data,
    })
}

export function updateCardApi(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/updateCard`,
        method: 'post',
        data: data,
    })
}


//============================


export function getAdminList(data: anyObj) {
    return createAxios({
        url: `/admin/auth.Admin/channel`,
        method: 'get',
        data: data,
    })
}



export function getAccountAudit(data: anyObj) {
    return createAxios({
        url: `/admin/Account/audit`,
        method: 'post',
        data: data,
    })
}

export function editIs_(data: anyObj) {
    return createAxios({
        url: `/admin/Account/editIs_`,
        method: 'post',
        data: data,
    })
}

export function getAccountNumber(data: anyObj) {
    return createAxios({
        url: `/admin/Account/getAccountNumber`,
        method: 'get',
    })
}

export function allAccountAudit(data: anyObj) {
    return createAxios({
        url: `/admin/Account/allAudit`,
        method: 'post',
        data: data,
    })
}

export function AccountDistribution(data: anyObj) {
    return createAxios({
        url: `/admin/Account/distribution`,
        method: 'post',
        data: data,
    })
}


export function accountrequestAudit(data: anyObj) {
    return createAxios({
        url: `/admin/addaccountrequest.Accountrequest/audit`,
        method: 'post',
        data: data,
    })
}


//*******************************AccountrequestProposal************************************* */

export function AccountrequestProposalIndex(data: anyObj) {
    return createAxios({
        url: `/admin/addaccountrequest.AccountrequestProposal/index`,
        method: 'get',
        params: data,
    })
}

export function AccountrequestProposalAudit(data: anyObj) {
    return createAxios({
        url: `/admin/addaccountrequest.AccountrequestProposal/audit`,
        method: 'post',
        data: data,
    })
}

export function AccountrequestProposalExport(data: anyObj) {
    return createAxios({
        url: `/admin/addaccountrequest.AccountrequestProposal/Export`,
        method: 'post',
        data: data,
    })
}

export function getAccountDisposeStatus(data: anyObj) {
    return createAxios({
        url: `/admin/Account/disposeStatus`,
        method: 'post',
        data: data,
    })
}


export function rechargeAudit(data: anyObj) {
    return createAxios({
        url: `/admin/demand.Recharge/audit`,
        method: 'post',
        data: data,
    })
}

export function bmAudit(data: anyObj) {
    return createAxios({
        url: `/admin/demand.Bm/audit`,
        method: 'post',
        data: data,
    })
}


export function bmDisposeStatus(data: anyObj) {
    return createAxios({
        url: `/admin/demand.Bm/disposeStatus`,
        method: 'post',
        data: data,
    })
}

export function getBmList(data: anyObj) {
    return createAxios({
        url: `/admin/demand.Bm/getBmList`,
        method: 'get',
        params: data,
    })
}

export function transferStatus(data: anyObj) {
    return createAxios({
        url: `/admin/demand.Transfer/audit`,
        method: 'post',
        data: data,
    })
}



export function accountCountMoney(data: anyObj) {
    return createAxios({
        url: `/admin/Account/accountCountMoney`,
        method: 'get',
        data: data,
    })
}


//========================= { card }=================================

export function cardInfo(data: anyObj) {
    return createAxios({
        url: `/admin/card.cards/cardInfo`,
        method: 'get',
        params: data,
    })
}

export function cardsTransactions(data: anyObj) {
    return createAxios({
        url: `/admin/card.cards/cardsTransactions`,
        method: 'get',
        params: data,
    })
}


export function cardFreeze(data: anyObj) {
    return createAxios({
        url: `/admin/card.cards/cardFreeze`,
        method: 'post',
        data: data,
        timeout:6000000
    })
}

export function cardUpdate(data: anyObj) {
    return createAxios({
        url: `/admin/card.cards/updateCard`,
        method: 'post',
        data: data,
        timeout:6000000
    })
}


export function getCard() {
    return createAxios({
        url: `/admin/card.cards/getCard`,
        method: 'get',
    })
}
// 扣款
export function postAdminCardCardsRechargeReturn(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/rechargeReturn`,
        method: 'post',
        data: data,
    })
}
// 修改限额
export function postAdminCardCardsUpdateCard(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/updateCard`,
        method: 'post',
        data: data,
    })
}
// 账户转账
export function postAdminCardCardsTransfer(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/transfer`,
        method: 'post',
        data: data,
    })
}
// 入账次数/金额
export function adminAuthAdminMoneyLogGetPurse(data: anyObj) {
    return createAxios({
        url: `/admin/auth.AdminMoneyLog/getPurse`,
        method: 'get',
        params: data,
    })
}
// 入账次数
export function adminAuthAdminMoneyLogGetPurseList(data: anyObj) {
    return createAxios({
        url: `/admin/auth.AdminMoneyLog/getPurseList`,
        method: 'get',
        params: data,
    })
}
// 公告列表
export function adminAnnouncementIndex(data: anyObj) {
    return createAxios({
        url: `/admin/Announcement/index`,
        method: 'get',
        params: data,
    })
}
// 公告-查看
export function adminAnnouncementedit(data: anyObj) {
    return createAxios({
        url: `/admin/Announcement/edit`,
        method: 'get',
        params: data,
    })
}
// 消费记录 - 导出
export function adminCardCardsTransactionsExcel(data: anyObj) {
    return createAxios({
        url: `/admin/card.CardsTransactions/excel`,
        method: 'post',
        data: data,
        timeout:6000000
    })
}
// 批量销户
export function postAdminCardCardsCancelCardIds(data: anyObj) {
    return createAxios({
        url: `/admin/card.Cards/cancelCardIds`,
        method: 'post',
        data: data
    })
}
