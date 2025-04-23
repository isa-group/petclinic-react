function formatVetSpecialities(specialties) {
  return specialties.map((specialty) => specialty.name).join(", ");
}

export function VetOptions({ vets, city }) {
  return (
    <>
      {!city && (
        <option value="">
          Before selecting a vet, select a city for the visit
        </option>
      )}
      {vets
        .filter((vet) => vet.city === city)
        .map((vet) => (
          <option key={vet.id} value={vet.id}>
            {vet.firstName} {vet.lastName + " "}
            {vet.specialties.length !== 0 ? " - " : ""}
            {formatVetSpecialities(vet.specialties)}
          </option>
        ))}
    </>
  );
}
