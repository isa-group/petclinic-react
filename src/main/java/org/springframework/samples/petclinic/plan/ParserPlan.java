package org.springframework.samples.petclinic.plan;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotBlank;

import org.springframework.samples.petclinic.model.BaseEntity;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "parser_plans")
public class ParserPlan extends BaseEntity{

    @Column(name = "max_pets_parser")
    @NotBlank
    private String maxPetsParser;

    @Column(name = "max_visits_per_month_and_pet_parser")
    @NotBlank
    private String maxVisitsPerMonthAndPetParser;

    @Column(name = "support_priority_parser")
    @NotBlank
    private String supportPriorityParser;

    @Column(name = "have_vet_selection_parser")
    @NotBlank
    private String haveVetSelectionParser;

    @Column(name = "have_calendar_parser")
    @NotBlank
    private String haveCalendarParser;

    @Column(name = "have_pets_dashboard_parser")
    @NotBlank
    private String havePetsDashboardParser;

    @Column(name = "have_online_consultations_parser")
    @NotBlank
    private String haveOnlineConsultationsParser;

}
