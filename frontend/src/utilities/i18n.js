import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome_message: "Welcome to RITECS Checking System!",
        start_button: "Get Started",
        image_button: "Images",
        filler_1: "Video",
        filler_2: "Data",
        file_name: "File Name",
        file_description: "Description",
        loading_message: "Loading...",
        no_image_error: "No image data found.",
        segmentation_data: "Segmentation data",
        start_selection_button: "Start Selection",
        current_date: "Current Date",
        instruction_label: "Instruction",
        instruction_message:
          "Select the regions that have mismatched colored boxes",
        sample_label: "Sample correct image",
        selection_label: "Selected Incorrect Regions",
        segment_label: "Segment",
        state_label: "Status",
        state_0: "Clear",
        state_1: "Foil on Cap",
        state_2: "No Tube",
        state_3: "No Cap",
        submit_button: "Submit",
        alert_message: "You have submitted the following corrections:{{ corrections }}",
      },
    },
    jp: {
      translation: {
        welcome_message: "RITECSチェックシステムへようこそ！",
        start_button: "始める",
        image_button: "画像",
        filler_1: "動画",
        filler_2: "データ",
        file_name: "ファイル名",
        file_description: "説明",
        loading_message: "読み込み中...",
        no_image_error: "画像データが見つかりません。",
        segmentation_data: "セグメンテーションデータ",
        start_selection_button: "選択を開始",
        current_date: "現在の日付",
        instruction_label: "指示",
        instruction_message: "色の異なるボックスがある領域を選択してください。",
        sample_label: "正しい画像のサンプル",
        selection_label: "選択された不正確な領域",
        segment_label: "セグメント",
        state_label: "ステータス",
        state_0: "クリア",
        state_1: "キャップにフォイル",
        state_2: "チューブなし",
        state_3: "キャップなし",
        submit_button: "送信",
        alert_message: "以下の訂正を送信しました：{{ corrections }}",
      },
    },
  },
  lng: "en", // initial language
  fallbackLng: "jp",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
