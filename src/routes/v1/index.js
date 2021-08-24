const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../../config/multer').upload;
const uploadSingle = upload.single('file');
const authController = require('../../controllers/v1/auth_controller');
const usersController = require('../../controllers/v1/users_controller');
const usersProjectsController = require('../../controllers/v1/users/users_projects_controller');
const usersProjectsInfosController = require('../../controllers/v1/users/users_projects_infos_controller');
const usersProjectsMemosController = require('../../controllers/v1/users/users_projects_memos_controller');
const usersProjectsStoresController = require('../../controllers/v1/users/users_projects_stores_controller');
const usersProjectsStoragesController = require('../../controllers/v1/users/users_projects_storages_controller');
const usersProjectsStoragesObjectsController = require('../../controllers/v1/users/users_projects_storages_objects_controller');
const projectsController = require('../../controllers/v1/projects_controller');
const projectsExternalLinksController = require('../../controllers/v1/projects/projects_external-links_controller');
const projectsUsersController = require('../../controllers/v1/projects/projects_users_controller');
const projectsTagsController = require('../../controllers/v1/projects/projects_tags_controller');
const storesController = require('../../controllers/v1/stores_controller');
const mailSend = require('../../utils/mailSendUtils').mailSend;

/**
 * --------------- ルーティング設定 ---------------
 */
/** general */
router.get("/health", validateParam([]), isParamInvalid, (req, res) => {
	res.status(200).json({ result: 'success', message: 'running' });
});
router.post("/upload", validateParam([]), isParamInvalid, uploadSingle, (req, res) => {
	var fullImageUrl = req.protocol + '://' + req.get('Host') + '/' + req.file.filename;
	res.status(200).json({ result: 'success', imagePath: fullImageUrl });
});
router.post("/request-defect", validateParam([]), isParamInvalid, async (req, res) => {
	const detail = req.body.detail
	const mailSendResult = await mailSend({
		subject: '【Agile Boost】要望・不具合のお知らせ',
		to: 'tanaka@agile.co.jp'
	}, 'request-defect', { detail })
	if(mailSendResult) {
		res.status(200).json({ result: 'success' });
	} else {
		res.status(200).json({ result: 'error', error_message: 'Failed to send email' });
	}
});

/** auth */
router.post("/auth/sign-up", validateParam(['userEmail', 'userPassword']), isParamInvalid, (req, res) => {
	authController.signUp(req, res)
});
router.post("/auth/sign-in", validateParam(['userEmail', 'userPassword']), isParamInvalid, (req, res, next) => {
	authController.signIn(req, res, next)
});
router.post("/auth/sign-out", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	authController.signOut(req, res)
});
router.get("/auth/me", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	res.status(200).json(req.user)
});
router.post('/auth/send-account-activation', validateParam(['userEmail']), isParamInvalid, (req, res) => {
	authController.sendAccountActivation(req, res)
});
router.post('/auth/begin-account-activation', validateParam(['activeTokenCode']), isParamInvalid, (req, res) => {
	authController.beginAccountActivation(req, res)
});
router.post("/auth/send-password-reset", validateParam(['userEmail']), isParamInvalid, (req, res) => {
	authController.sendPasswordReset(req, res)
});
router.post("/auth/begin-password-reset", validateParam(['resetPasswordToken', 'userPassword']), isParamInvalid, (req, res) => {
	authController.beginPasswordReset(req, res)
});


/** users */
router.patch("/users", checkAuthentication, validateParam(["userName", "userIconPath"]), isParamInvalid, (req, res) => {
	usersController.update(req, res)
});
router.delete("/users", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersController.destroy(req, res)
});
router.get("/users/projects", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsController.index(req, res)
});
router.post("/users/projects", checkAuthentication, validateParam(["projectId"]), isParamInvalid, (req, res) => {
	usersProjectsController.create(req, res)
});
router.get("/users/projects/:projectId", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsController.show(req, res)
});
router.delete("/users/projects/:projectId", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsController.destroy(req, res)
});
router.get("/users/projects/:projectId/infos", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsInfosController.index(req, res)
});
router.post("/users/projects/:projectId/infos", checkAuthentication, validateParam(["infoTitle", "infoDetail"]), isParamInvalid, (req, res) => {
	usersProjectsInfosController.create(req, res)
});
router.delete("/users/projects/:projectId/infos/:infoId", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsInfosController.destroy(req, res)
});
router.get("/users/projects/:projectId/memos", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsMemosController.index(req, res)
});
router.post("/users/projects/:projectId/memos", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsMemosController.create(req, res)
});
router.patch("/users/projects/:projectId/memos/:memoId", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsMemosController.update(req, res)
});
router.delete("/users/projects/:projectId/memos/:memoId", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsMemosController.destroy(req, res)
});
router.get("/users/projects/:projectId/stores", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsStoresController.index(req, res)
});
router.post("/users/projects/:projectId/stores", checkAuthentication, validateParam(["storeId"]), isParamInvalid, (req, res) => {
	usersProjectsStoresController.create(req, res)
});
router.delete("/users/projects/:projectId/stores/:storeId", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsStoresController.destroy(req, res)
});
router.get("/users/projects/:projectId/storages", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsStoragesController.index(req, res)
});
router.post("/users/projects/:projectId/storages", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsStoragesController.create(req, res)
});
router.get("/users/projects/:projectId/storages/:storageId/objects", checkAuthentication, validateParam(["currentPath"]), isParamInvalid, (req, res) => {
	usersProjectsStoragesObjectsController.index(req, res)
});
router.post("/users/projects/:projectId/storages/:storageId/objects", checkAuthentication, validateParam(["currentPath"]), isParamInvalid, (req, res) => {
	usersProjectsStoragesObjectsController.create(req, res)
});
router.get("/users/projects/:projectId/storages/:storageId/objects/:objectName", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsStoragesObjectsController.show(req, res)
});
router.delete("/users/projects/:projectId/storages/:storageId/objects/:objectName", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	usersProjectsStoragesObjectsController.destroy(req, res)
});


/** projects */
router.get("/projects", validateParam([]), isParamInvalid, (req, res) => {
	projectsController.index(req, res)
});
router.get("/projects/:projectId", validateParam([]), isParamInvalid, (req, res) => {
	projectsController.show(req, res)
});
router.patch("/projects/:projectId", validateParam(["projectName", "isPrivate", "seacretCode"]), isParamInvalid, (req, res) => {
	projectsController.update(req, res)
});
router.get("/projects/:projectId/external-links", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	projectsExternalLinksController.index(req, res)
});
router.post("/projects/:projectId/external-links", checkAuthentication, validateParam(["serviceName", "iconPath", "accessUrl"]), isParamInvalid, (req, res) => {
	projectsExternalLinksController.create(req, res)
});
router.get("/projects/:projectId/users", checkAuthentication, validateParam([]), isParamInvalid, (req, res) => {
	projectsUsersController.index(req, res)
});
router.get("/projects/:projectId/tags", validateParam([]), isParamInvalid, (req, res) => {
	projectsTagsController.index(req, res)
});


/** stores */
router.get("/stores", validateParam([]), isParamInvalid, (req, res) => {
	storesController.index(req, res)
});


/**
 * --------------- チェックメソッド ---------------
 */
/**
 * ログイン必須判定
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function checkAuthentication(req, res, next) {
	if (req.isAuthenticated()) {	// ログイン中
    	next()
	} else {						// 未ログイン中
		res.status(401).json({ result: 'error', error_message: "InvalidAuthenticationInfo" });
  	}
}

/**
 * URLパラメーターエラー存在チェック
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function isParamInvalid(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {		// パラメーターエラー有り
		res.status(400).json({ data: 'Parameter Invalid', detail: errors.array() });
	} else {						// パラメーターエラー無し
		next()
	}
}

/**
 * URLパラメーターバリデーション
 * @param paramList バリデーションチェック対象のパラメーター名
 * @returns checkList バリデーションチェック対象のメソッドリスト
 */
function validateParam(paramList) {
	var checkList = []
	/** ユーザー関連 */
	if (paramList.some(c => c === 'userEmail')) {
		checkList.push(
			body('userEmail').not().isEmpty().withMessage('メールアドレスは必須項目')
								.isEmail().withMessage('メールアドレスの形式不備')
		)
	}
	if (paramList.some(c => c === 'userPassword')) {
		checkList.push( body('userPassword').not().isEmpty().withMessage('パスワードは必須項目') )
	}
	if (paramList.some(c => c === 'activeTokenCode')) {
		checkList.push( body('activeTokenCode').not().isEmpty().withMessage('有効化コードは必須項目') )
	}
	if (paramList.some(c => c === 'resetPasswordToken')) {
		checkList.push( body('resetPasswordToken').not().isEmpty().withMessage('パスワード再設定トークンは必須項目') )
	}
	/** プロジェクト関連 */
	if (paramList.some(c => c === 'projectName')) {
		checkList.push( body('projectName').not().isEmpty().withMessage('プロジェクト名は必須項目') )
	}
	if (paramList.some(c => c === 'isPrivate')) {
		checkList.push( body('isPrivate').not().isEmpty().withMessage('非公開フラグは必須項目') )
	}
	if (paramList.some(c => c === 'seacretCode')) {
		checkList.push( body('seacretCode').not().isEmpty().withMessage('認証コードは必須項目') )
	}
	if (paramList.some(c => c === 'infoTitle')) {
		checkList.push( body('infoTitle').not().isEmpty().withMessage('お知らせタイトルは必須項目') )
	}
	if (paramList.some(c => c === 'infoDetail')) {
		checkList.push( body('infoDetail').not().isEmpty().withMessage('お知らせ内容は必須項目') )
	}
	if (paramList.some(c => c === 'serviceName')) {
		checkList.push( body('serviceName').not().isEmpty().withMessage('サービス名は必須項目') )
	}
	if (paramList.some(c => c === 'iconPath')) {
		checkList.push( body('iconPath').not().isEmpty().withMessage('アイコンパスは必須項目') )
	}
	if (paramList.some(c => c === 'accessUrl')) {
		checkList.push( body('accessUrl').not().isEmpty().withMessage('アクセスURLは必須項目') )
	}
	if (paramList.some(c => c === 'storeId')) {
		checkList.push( body('storeId').not().isEmpty().withMessage('ストアIDは必須項目') )
	}
	return checkList;
}

module.exports = router;