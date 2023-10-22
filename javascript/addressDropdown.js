var my_handlers = {
  fillProvinces: function () {
    var regionCode = $(this).val();
    $("#province").ph_locations("fetch_list", [{ region_code: regionCode }]);
  },

  fillCities: function () {
    var provinceCode = $(this).val();
    $("#city").ph_locations("fetch_list", [{ province_code: provinceCode }]);
  },

  fillBarangays: function () {
    var cityCode = $(this).val();
    $("#barangay").ph_locations("fetch_list", [{ city_code: cityCode }]);
  },

  fillProvincesAdmin: function () {
    var regionCode = $(this).val();
    $("#provinceAdmin").ph_locations("fetch_list", [{ region_code: regionCode }]);
  },

  fillCitiesAdmin: function () {
    var provinceCode = $(this).val();
    $("#cityAdmin").ph_locations("fetch_list", [{ province_code: provinceCode }]);
  },

  fillBarangaysAdmin: function () {
    var cityCode = $(this).val();
    $("#barangayAdmin").ph_locations("fetch_list", [{ city_code: cityCode }]);
  },
};

$(function () {
  $("#region").on("change", my_handlers.fillProvinces);
  $("#province").on("change", my_handlers.fillCities);
  $("#city").on("change", my_handlers.fillBarangays);

  $("#region").ph_locations({ location_type: "regions" });
  $("#province").ph_locations({ location_type: "provinces" });
  $("#city").ph_locations({ location_type: "cities" });
  $("#barangay").ph_locations({ location_type: "barangays" });

  $("#province").ph_locations("fetch_list");

  $("#regionAdmin").on("change", my_handlers.fillProvincesAdmin);
  $("#provinceAdmin").on("change", my_handlers.fillCitiesAdmin);
  $("#cityAdmin").on("change", my_handlers.fillBarangaysAdmin);

  $("#regionAdmin").ph_locations({ location_type: "regions" });
  $("#provinceAdmin").ph_locations({ location_type: "provinces" });
  $("#cityAdmin").ph_locations({ location_type: "cities" });
  $("#barangayAdmin").ph_locations({ location_type: "barangays" });

  $("#provinceAdmin").ph_locations("fetch_list");
});
