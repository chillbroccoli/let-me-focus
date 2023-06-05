let params = new URL(document.location).searchParams;
const blockedSite = params.get("site");

const blockedSiteElement = document.getElementById("blockedSite");

blockedSiteElement.innerText = `${blockedSite} probably has been blocked for a reason`;
