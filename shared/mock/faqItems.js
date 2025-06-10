import { useTranslation } from "react-i18next";

// Custom hook that returns translated FAQ items
export const useFAQItems = () => {
  const { t } = useTranslation();
  
  return [
    {
      question: t("what_are_your_working_hours"),
      answer: t("our_stores_are_open_from_10_00_am_to_8_00_pm_monday_to_sunday"),
    },
    {
      question: t("is_parking_available_at_your_stores"),
      answer: t("yes_there_is_limited_parking_available_in_front_of_both_locations"),
    },
    {
      question: t("who_designs_your_products"),
      answer: t("all_designs_are_created_by_our_own_professional_team"),
    },
    {
      question: t("where_are_your_products_manufactured"),
      answer: t("all_our_designs_are_created_by_our_own_team_and_production_is_carried_out_in_turkey"),
    },
    {
      question: t("do_your_products_come_with_a_warranty"),
      answer: t("yes_we_provide_a_warranty_for_all_our_products"),
    },
    {
      question: t("do_you_own_all_the_product_photos"),
      answer: t("yes_all_product_photos_and_shoots_are_our_exclusive_property"),
    },
  ];
};
