'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    /**
     * --------------- マスター情報 ---------------
     */
    /** ユーザー */
    await queryInterface.bulkInsert('users', [{
      user_id: 1,
      user_email: 'root@agile.boost',
      user_password: '880ca875d8e634a0c613a2509c8a4109f3885851a228c9b0338c58697de82e78a7a0745957c0ce4f7f6d5f77f7073b73696d61a602595f8c1e0cb3f0b80430a7',
      password_salt: '8ae2a31f015f492f10dbd4b975fa5fbae34728c7baed032b92e1cbdc0d059e44',
      is_active: true,
      active_token_code: '',
      active_token_expair: null,
      user_name: 'Agile Boost',
      user_icon_path: 'http://localhost:4200/images/user-icon-random0.png',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    /** プロジェクト */
    await queryInterface.bulkInsert('projects', [
      {
        project_id: 'develop-public',
        project_name: '開発用公開案件',
        project_icon_path: 'https://www.photock.jp/photo/middle/photo0000-4087.jpg',
        is_private: false,
        seacret_code: null,
        seacret_code_expair: null,
        created_at: new Date(),
        updated_at: new Date()
      },{
        project_id: 'develop-private',
        project_name: '開発用非公開案件',
        project_icon_path: 'https://kumasyumi.com/wp-content/uploads/2020/02/9CFD5291-0F6C-46FC-AC03-C39C577533FD.png',
        is_private: true,
        seacret_code: "password",
        seacret_code_expair: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    /** タグ */
    await queryInterface.bulkInsert('tags', [
      {
        tag_id: 1,
        tag_name: '公開',
        created_at: new Date(),
        updated_at: new Date()
      },{
        tag_id: 2,
        tag_name: '非公開',
        created_at: new Date(),
        updated_at: new Date()
      },{
        tag_id: 3,
        tag_name: '開発用案件',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    /** プロジェクト > タグ */
    await queryInterface.bulkInsert('project_tags', [
      {
        project_id: 'develop-public',
        tag_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },{
        project_id: 'develop-public',
        tag_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },{
        project_id: 'develop-private',
        tag_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },{
        project_id: 'develop-private',
        tag_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    /** ストア */
    await queryInterface.bulkInsert('stores', [
      {
        name: 'Choice',
        description: 'ルーレット、あみだくじを用いた抽選が可能。',
        icon_path: '/store/choice.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Chat',
        description: 'オリジナルインターフェースでのチャットが可能です。',
        icon_path: '/store/chat.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Task',
        description: 'オリジナルインターフェースでのタスク管理が可能です。',
        icon_path: '/store/task.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Settings',
        description: 'プロジェクト内での通知/表示等のカスタム設定が可能です。',
        icon_path: '/store/settings.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Calendar',
        description: 'オリジナルインターフェースでのカレンダー管理が可能です。',
        icon_path: '/store/calendar.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Storage',
        description: 'オリジナルインターフェースでのストレージ管理が可能です。',
        icon_path: '/store/storage.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Questionnaire',
        description: 'プロジェクト内でのアンケート収集が可能です。',
        icon_path: '/store/questionnaire.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Google Drive',
        description: 'Googleドライブにアクセスしのファイルのアップロード/ダウンロードが可能。',
        icon_path: '/store/google-drive.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: '人事労務フリー',
        description: '勤怠入力の自動化等が可能です。',
        icon_path: '/store/人事労務フリー.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Zoom',
        description: 'Agile Boost内でのZoomが可能です。',
        icon_path: '/store/zoom.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Q & A',
        description: 'プロジェクト内でにQ&Aが可能です。',
        icon_path: '/store/q&a.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'Chatwork',
        description: 'Agile Boost内でのChatworkが可能です。',
        icon_path: '/store/chatwork.png',
        created_at: new Date(),
        updated_at: new Date()
      },{
        name: 'CI/CD',
        description: 'プロジェクト内でにCI/CDが可能です。',
        icon_path: '/store/ci-cd.jpg',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
