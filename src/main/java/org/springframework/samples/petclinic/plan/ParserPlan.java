package org.springframework.samples.petclinic.plan;

import java.util.Map;
import java.util.HashMap;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.springframework.samples.petclinic.model.BaseEntity;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "parser_plans")
public class ParserPlan extends BaseEntity{

    @Column(name = "max_pets_parser")
    @NotNull
    private String maxPetsParser;

    @Column(name = "max_visits_per_month_and_pet_parser")
    @NotNull
    private String maxVisitsPerMonthAndPetParser;

    @Column(name = "support_priority_parser")
    @NotNull
    private String supportPriorityParser;

    @Column(name = "have_vet_selection_parser")
    @NotNull
    private String haveVetSelectionParser;

    @Column(name = "have_calendar_parser")
    @NotNull
    private String haveCalendarParser;

    @Column(name = "have_pets_dashboard_parser")
    @NotNull
    private String havePetsDashboardParser;

    @Column(name = "have_online_consultations_parser")
    @NotNull
    private String haveOnlineConsultationsParser;

    public Map<String, String> parseToMap() {
		Map<String, String> map = new HashMap<>();

		Field[] fields = this.getClass().getDeclaredFields();
		for (Field field : fields) {
			field.setAccessible(true);
			String fieldName = field.getName();
			if (fieldName.equals("id") || fieldName.equals("name") || fieldName.equals("price")) {
				continue;
			}
			try {
				Object fieldValue = field.get(this);
				map.put(fieldName.replace("Parser", ""), (String) fieldValue);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			}

		}

		return map;
	}

}
