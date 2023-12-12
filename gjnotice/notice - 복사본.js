

let noticelyr = null;
const portalUrl = "https://smart.incheon.go.kr/portal/home"
const itemID = "a07d646a65144a2cb64d11b9b82efe61"

function getNoticeLayer(esriConfig, FeatureLayer) {
	esriConfig.portalUrl = portalUrl
	const noticelyr = new FeatureLayer({
		portalItem: {
			id: itemID
		}
	});
	return noticelyr;
}

function notice(page) {
	require([
		"esri/layers/FeatureLayer","esri/rest/support/Query", "esri/config"
		],
		(FeatureLayer, Query, esriConfig) => {
			if(noticelyr == null)
			{
				//esriConfig.portalUrl = "https://smart.incheon.go.kr/portal"
				noticelyr = getNoticeLayer(esriConfig, FeatureLayer);
			}
			const queryParams = new Query({
				outFields : "*",
				where : "1=1",
				orderByFields : "notidate desc"
			})
			try{
				const urlStr = window.location.href	
				const url = new URL(urlStr)
				const urlParams = url.searchParams;
				const editobjid = urlParams.get('hasland')
				alert('성공');
				alert(urlParams);
			}catch(err){
				alert('실패');
				alert(err.message); 
			}
			
		

		})
}

