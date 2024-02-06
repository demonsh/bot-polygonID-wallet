import axios from "axios";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from './LocalStorage.services';
import { AuthHandler, core } from '@0xpolygonid/js-sdk';
const { DID } = core;

export async function approveMethod(msgBytes) {
    let did = DID.parse(LocalStorageServices.getActiveAccountDid());

    const { packageMgr, proofService } = ExtensionService.getExtensionServiceInstance();

    let authHandler = new AuthHandler(packageMgr, proofService);
    const authRes = await authHandler.handleAuthorizationRequest(did, msgBytes);
    console.log(authRes.authRequest.body.callbackUrl);
    const config = {
        headers: {
            'Content-Type': 'text/plain'
        },
        responseType: 'json'
    };
    return await axios
      .post(authRes.authRequest.body.callbackUrl, authRes.token, config)
      .then((response) => response)
      .catch((error) => error.toJSON());
}
