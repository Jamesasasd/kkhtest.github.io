

let currentFeature = null;
let noticelyr = null;
const portalUrl = "https://portal.esrikr.com/portal/home"
const itemID = "747b7cb14b784a57969bef8af921a5ff"

function nta_addnotice(){
	alert('등록이 완료되었습니다.1')
	location.href='./notice_admin.html'
} 

function nta_deletenotice_chk(){
	alert('삭제가 완료되었습니다.')
	location.href='./notice_admin.html'	
}

function nta_deletenotice(){
	alert('삭제가 완료되었습니다.')
	location.href='./notice_admin.html'	
}

function ntn_gotoadmin(){
	location.href='./notice_admin.html'
} 

function nta_newnoti(){
	location.href='./notice_new.html'
}

function ntn_addfc() {
	require([
		"esri/layers/FeatureLayer","esri/rest/support/Query", "esri/config", "esri/Graphic"
		],
		(FeatureLayer, Query, esriConfig, Graphic) => {

			const getdate = new Date(document.getElementById('ntn_datepicker').value).getTime()

			const attributes = {};
			attributes["title"] =  document.getElementById('ntn_title').value;
			attributes["notidate"] = getdate;
			attributes["noti_desc"] = document.getElementById('ntn_desc').value;
			if(noticelyr == null)
			{
				noticelyr = getNoticeLayer(esriConfig, FeatureLayer);
			}
			
			const addFeature = new Graphic({
				attributes : attributes
			})

			noticelyr.applyEdits({
				addFeatures : [addFeature]
			})
		})
}

function getNoticeLayer(esriConfig, FeatureLayer) {
	esriConfig.portalUrl = portalUrl
	const noticelyr = new FeatureLayer({
		portalItem: {
			id: itemID
		}
	});
	return noticelyr;
}

function nta_gotoedit(objid) {
	location.href='./notice_edit.html?objid='+	objid

}

function nta_deletefc_chk() {			
	require([
		"esri/layers/FeatureLayer","esri/rest/support/Query", "esri/config"
		],
		(FeatureLayer, Query, esriConfig) => {
			esriConfig.portalUrl = portalUrl
			if(noticelyr == null)
			{
				noticelyr = getNoticeLayer(esriConfig, FeatureLayer);
			}

			var deleteFeatures = []

			var checklist = document.getElementsByName("nta_checklist");
			for(var i=0; i<checklist.length; i++) {
				if(checklist[i].checked == true)
					{
						deleteFeatures.push( { objectId: checklist[i].value })
					}
			}
			noticelyr.applyEdits({
				deleteFeatures: deleteFeatures
			})
		})
}


function nta_delete(objid) {
	require([
		"esri/layers/FeatureLayer","esri/rest/support/Query", "esri/config"
		],
		(FeatureLayer, Query, esriConfig) => {

			if(noticelyr == null)
			{
				esriConfig.portalUrl = portalUrl
				noticelyr = getNoticeLayer(esriConfig, FeatureLayer);
			}

			var deleteFeatures = []
			deleteFeatures.push( { objectId: objid })
			noticelyr.applyEdits({
				deleteFeatures: deleteFeatures
			})
		})
}

function nta_edit() {
	const urlStr = window.location.href	
	const url = new URL(urlStr)
	const urlParams = url.searchParams;
	const editobjid = urlParams.get('objid')
	console.log(editobjid)

	require([
		"esri/layers/FeatureLayer","esri/rest/support/Query", "esri/config", "esri/Graphic"
		],
		(FeatureLayer, Query, esriConfig, Graphic) => {
			// nta_delete(editobjid)
			// ntn_addfc()

			if(currentFeature && currentFeature != null)
			{
				if(noticelyr == null)
				{
					esriConfig.portalUrl = portalUrl
					noticelyr = getNoticeLayer(esriConfig, FeatureLayer);
				}
	
				var updateFeatures = []

				currentFeature.attributes.title =  document.getElementById('ntn_title').value
				currentFeature.attributes.noti_desc =  document.getElementById('ntn_desc').value 
				currentFeature.attributes.notidate = Date.parse(document.getElementById('ntn_datepicker').value)

				updateFeatures.push(currentFeature)
				//console.log(updateFeatures)
				noticelyr.applyEdits({
					updateFeatures: updateFeatures
				}).then((results) => {
					console.log(results)
					currentFeature = null;
					alert('수정이 완료되었습니다.')
					ntn_gotoadmin();
					
				}) .catch((error) => {    
					   console.log("error = ", error);     
				});
			}else
			{
				console.log('no feature selected.')
			}
		})
}

function nta_delete_func(objid) {
  new Promise((resolve, reject) => {
    nta_delete(objid)
    resolve(); 
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        nta_deletenotice();   
        resolve();
      }, 200);
    });
  })
  .catch((err) => {
    console.log('err ', err);
  });
}

function nta_deletefc_chk_func() {
  new Promise((resolve, reject) => {
    nta_deletefc_chk()
    resolve(); 
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        nta_deletenotice_chk();   
        resolve();
      }, 200);
    });
  })
  .catch((err) => {
    console.log('err ', err);
  });
}


function ntn_addnotice_func() {
 new Promise((resolve, reject) => {
    ntn_addfc()
    resolve(); 
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        nta_addnotice();   
        resolve();
      }, 200);
    });
  })
  .catch((err) => {
    console.log('err ', err);
  });
}

function convertDate(milliSecond) {
  const data = new Date(milliSecond);  //Date객체 생성

  const year = data.getFullYear();    //0000년 가져오기
  const month = ('0' + (data.getMonth() + 1)).slice(-2);  //월은 0부터 시작하니 +1하기
  const date = ('0' + data.getDate()).slice(-2);        //일자 가져오기

  return `${year}-${month}-${date}`;
}

function paging(totalcount, rowperpage, currentpage, type) {
	console.log(type)
	const rowperPage = rowperpage;
	const pageCount = 5 //한페이지당
	const currentPage = currentpage
	const totalPage = Math.ceil(totalcount/rowperPage)
	const pageGroup = Math.ceil(currentPage / pageCount)

	var pprevPage = 1
	var prevPage = (Math.ceil(currentPage/pageCount)-1)*pageCount	
	var nextPage = (Math.ceil(currentPage/pageCount)*pageCount)+1
	var nnextPage = totalPage

	console.log(pprevPage, prevPage, nextPage, nnextPage)
	console.log(pageGroup)
	const html = ''

	let lastNumber = pageGroup * pageCount // 5
	if (lastNumber > totalPage) {
	  lastNumber = totalPage
	}
	let firstNumber = lastNumber - (pageCount - 1) // 1
	if(firstNumber < 1)
		firstNumber = 1

	const next = lastNumber + 1 // 6
	const prev = firstNumber - 1 // 0

	// 1~5만큼 페이지네이션 그려줌
	var pageName = type
	
	if(currentPage > pageCount && totalPage > pageCount) {
		gotoPage = type
		pprevPage = String(gotoPage + pprevPage)
		prevPage = String(gotoPage + prevPage)
		$("#page_num").append("<a class='arrow pprev' href="+ pprevPage + "></a>")
		$("#page_num").append("<a class='arrow prev' href="+ prevPage + "></a>")
	}

	for (let i = firstNumber; i <= lastNumber; i++) {
		gotoPage = String(type+ i)
		if(i == currentPage)
			$("#page_num").append("<a class='active' href="+gotoPage + ">" + i + "</a>");
		else
			$("#page_num").append("<a href="+gotoPage + ">" + i + "</a>");
	} 
	console.log(totalPage)
	if(totalPage > pageCount && currentPage < totalPage &&nextPage < totalPage ) {
		gotoPage = type
		nextPage = String(gotoPage + nextPage)
		nnextPage = String(gotoPage + nnextPage)
		$("#page_num").append("<a class='arrow next' href="+ nextPage + "></a>")
		$("#page_num").append("<a class='arrow nnext' href="+ nnextPage + "></a>")
	}

}

function notice(page) {
	require([
		"esri/layers/FeatureLayer","esri/rest/support/Query", "esri/config"
		],
		(FeatureLayer, Query, esriConfig) => {
			if(noticelyr == null)
			{
				esriConfig.portalUrl = "https://untest.esrikr.com/portal"
				noticelyr = getNoticeLayer(esriConfig, FeatureLayer);
			}
			
			const queryParams = new Query({
				outFields : "*",
				where : "1=1",
				orderByFields : "notidate desc"
			})
			
			if (page == 'notice_view_full'){
				location.href='./notice_view_full_paging.html?pagination=1'
			}
			else if (page == 'notice_view_pagination') {
				latestnoticetbl(noticelyr, queryParams, 'ntv_notitbl')
			}
			else if (page == 'notice_view_selected') {
				const urlStr = window.location.href	
				const url = new URL(urlStr)
				const urlParams = url.searchParams;
				const editobjid = urlParams.get('objid')

				const selectParms = new Query({
					outFields : "*",
					where : "objectid=" + editobjid,
				})

				var objidtitle = ""
				var objiddesc = ""
				var objidnotidate = ""

				const selectedfc = noticelyr.queryFeatures(selectParms).then(function(response){
					var fc = response.features[0].attributes

					document.getElementById('ntvs_title').innerText = fc.title
					document.getElementById('ntvs_notidate').innerText = convertDate(fc.notidate)
					document.getElementById('ntvs_desc').innerText = fc.noti_desc
					
				})				
			}
			else if (page == 'notice_new'){
				window.onload = function () {
					var today = new Date();

					var year = today.getFullYear();
					var month = ('0' + (today.getMonth() + 1)).slice(-2);
					var day = ('0' + today.getDate()).slice(-2);

					var dateString = year + '-' + month  + '-' + day;

					document.getElementById('ntn_datepicker').value = dateString	
				}
			}
			else if(page == 'notice_admin'){
				location.href='./notice_admin_paging.html?pagination=1'
			}
			else if(page == 'notice_admin_pagination'){
				adminnoticetbl(noticelyr, queryParams, 'nta_notitbl')
			}
			else if(page == 'notice_edit'){
				const urlStr = window.location.href	
				const url = new URL(urlStr)
				const urlParams = url.searchParams;
				const editobjid = urlParams.get('objid')

				const editParms = new Query({
					outFields : "*",
					where : "objectid=" + editobjid,
				})

				var objidtitle = ""
				var objiddesc = ""
				var objidnotidate = ""

				const editfc = noticelyr.queryFeatures(editParms).then(function(response){
					var fc = response.features[0].attributes
					document.getElementById('ntn_title').value = fc.title
					document.getElementById('ntn_desc').value = fc.noti_desc
					document.getElementById('ntn_datepicker').value = convertDate(fc.notidate)
		
					currentFeature =  response.features[0];
					console.log(currentFeature);
				})				
			}

			

			//공지 시간 순 호출(notice_view, notice_admin 페이지에서 호출)
			function latestnoticetbl(lyr, params, tblid) {
				const latesnotice = lyr.queryFeatures(params).then(function(response){
					var count = 1;
					var urlStr = window.location.href	
					var url = new URL(urlStr)
					var urlParams = url.searchParams;
					var pagenation = urlParams.get('pagination')
					var rowcount = 5
					paging(response.features.length, rowcount, pagenation, './notice_view_full_paging.html?pagination=')

					var tblstart = (pagenation * rowcount) - rowcount//1page > 5개씩이면 5 부터 시작 배열 0부터 시작
					var tblend = tblstart + rowcount //
					if (tblend > response.features.length) {
						tblend = response.features.length
					}
					for(var i=tblstart; i<tblend; i++) {
						var row = response.features[i].attributes
						addrow_ntv(tblid, row.objectid, row.title, row.noti_desc, row.notidate, count)
						count++
					}
				})
			}

			function adminnoticetbl(lyr, params, tblid) {
				const adminnotice = lyr.queryFeatures(params).then(function(response){
					console.log('//')
					var count = 1;
					var urlStr = window.location.href	
					var url = new URL(urlStr)
					var urlParams = url.searchParams;
					var pagenation = urlParams.get('pagination')
					var rowcount = 10
					paging(response.features.length, rowcount, pagenation, './notice_admin_paging.html?pagination=')

					var tblstart = (pagenation * rowcount) - rowcount//1page > 5개씩이면 5 부터 시작 배열 0부터 시작
					var tblend = tblstart + rowcount //
					if (tblend > response.features.length) {
						tblend = response.features.length
					}

					for(var i=tblstart; i<tblend; i++) {
						var row = response.features[i].attributes
						addrow_nta(tblid, row.objectid, row.title, row.noti_desc, row.notidate, count)
						count++
					}
				})
			}

			//notice_view, notice_admin 	
			function addrow_ntv(tblid, objid, title, desc, notidt, count){
				const table = document.getElementById(tblid);
				// 새 행(Row) 추가
				const newRow = table.insertRow();
				  
				// 새 행(Row)에 Cell 추가
				//const newCellcheck = newRow.insertCell(0)
				const newCellNo = newRow.insertCell(0) 
				const newCelltitle = newRow.insertCell(1);
				//const newCelldesc = newRow.insertCell(2); 
				const newCelldate = newRow.insertCell(2);

				// Cell에 텍스트 추가
				var gotoPage = String('./notice_view_selected.html?objid=' + objid)

				newCellNo.innerText = count;
				newCelltitle.innerHTML = ("<a style = 'text-decoration: none;  color: #004'  href="+gotoPage + ">" + title + "</a>");
				//newCelldesc.innerText = desc
				newCelldate.innerText = convertDate(notidt);
			}

			function addrow_nta(tblid, objid, title, desc, notidt, count){
				const table = document.getElementById(tblid);
				// 새 행(Row) 추가
				const newRow = table.insertRow();
				  
				// 새 행(Row)에 Cell 추가
				const newCellcheck = newRow.insertCell(0) 
				const newCelltitle = newRow.insertCell(1);
				const newCelldesc = newRow.insertCell(2); 
				const newCelldate = newRow.insertCell(3);
				const newCelledit = newRow.insertCell(4);

				// Cell에 텍스트 추가
				newCellcheck.innerHTML = '<label><input type="checkbox" name=nta_checklist value="' + objid  +'" unchecked></label>'
				newCelltitle.innerText = title;
				newCelldesc.innerText = desc
				newCelldate.innerText = convertDate(notidt);
				newCelledit.innerHTML = '<button onclick="nta_gotoedit(this.value)" value="' + objid  +'">수정</button> <button onclick="nta_delete_func(this.value)" value="' + objid  +'">삭제</button>'
			}

		})
}

