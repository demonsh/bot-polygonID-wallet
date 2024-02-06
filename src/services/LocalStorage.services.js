export class LocalStorageServices {
    static getActiveAccount() {
        let allAccounts = JSON.parse(localStorage.getItem('accounts'));

        return allAccounts.filter(acc => acc.isActive);
    }

    static getActiveAccountDid() {
        let activeAccount = LocalStorageServices.getActiveAccount();
        return activeAccount[0].did;
    }
}
