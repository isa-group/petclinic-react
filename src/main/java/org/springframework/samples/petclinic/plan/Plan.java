package org.springframework.samples.petclinic.plan;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.samples.petclinic.model.BaseEntity;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "plans")
public class Plan extends BaseEntity{
    
    @Column(name = "name")
    @Enumerated(EnumType.STRING)
	@NotNull
	private PricingPlan name;

    @Column(name = "price")
    @NotNull
    private Double price;

    @Column(name = "max_pets")
    @NotNull
    private Integer maxPets;

    @Column(name = "max_visits_per_month_and_pet")
    @NotNull
    private Integer maxVisitsPerMonthAndPet;

    @Column(name = "support_priority")
    @Enumerated(EnumType.STRING)
    @NotNull
    private SupportPriorityType supportPriority;

    @Column(name = "have_vet_selection")
    @NotNull
    private Boolean haveVetSelection;

    @Column(name = "have_calendar")
    @NotNull
    private Boolean haveCalendar;

    @Column(name = "have_pets_dashboard")
    @NotNull
    private Boolean havePetsDashboard;

    @Column(name = "have_online_consultations")
    @NotNull
    private Boolean haveOnlineConsultations;

}
