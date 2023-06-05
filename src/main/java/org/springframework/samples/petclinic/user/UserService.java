/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.user;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.security.auth.message.AuthException;
import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.clinic_owner.ClinicOwner;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.feature.FeatureController;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.plan.Plan;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse.Feature;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse.Feature.ValueType;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.eventbus.DeadEvent;

@Service
public class UserService {

	private UserRepository userRepository;

//	private OwnerService ownerService;
//
	private VetService vetService;

	@Autowired
	public UserService(UserRepository userRepository, VetService vetService) {
		this.userRepository = userRepository;
//		this.ownerService = ownerService;
		this.vetService = vetService;
	}

	@Transactional
	public User saveUser(User user) throws DataAccessException {
		userRepository.save(user);
		return user;
	}

	@Transactional(readOnly = true)
	public User findUser(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
	}

	@Transactional(readOnly = true)
	public User findUser(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
	}

	@Transactional(readOnly = true)
	public Owner findOwnerByUser(String username) {
		return userRepository.findOwnerByUser(username)
				.orElseThrow(() -> new ResourceNotFoundException("Owner", "username", username));
	}

	@Transactional(readOnly = true)
	public Vet findVetByUser(int userId) {
		return userRepository.findVetByUser(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Vet", "id", userId));
	}

	@Transactional(readOnly = true)
	public ClinicOwner findClinicOwnerByUser(int userId) {
		return userRepository.findClinicOwnerByUser(userId)
				.orElseThrow(() -> new ResourceNotFoundException("ClinicOwner", "id", userId));
	}

	@Transactional(readOnly = true)
	public Owner findOwnerByUser(int id) {
		return userRepository.findOwnerByUser(id).orElseThrow(() -> new ResourceNotFoundException("Owner", "ID", id));
	}

	@Transactional(readOnly = true)
	public User findCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null)
			throw new ResourceNotFoundException("Nobody authenticated!");
		else
			return userRepository.findByUsername(auth.getName())
					.orElseThrow(() -> new ResourceNotFoundException("User", "Username", auth.getName()));
	}

	@Transactional(readOnly = true)
	public Map<String, Feature> findFeaturesByUser() throws AuthException{

		User user = null;

		try{
			user = findCurrentUser();
		}catch(ResourceNotFoundException e){
			System.out.println("User not found");
			return findPublicFeatures();
		}

		switch (user.getAuthority().getAuthority()) {
		case "OWNER":
			Owner owner = findOwnerByUser(user.getId());
			return findFeaturesByOwner(owner);
		case "VET":
			Vet vet = findVetByUser(user.getId());
			return findFeaturesByVet(vet);
		case "ADMIN":
			return findFeaturesByAdmin(user);
		case "CLINIC_OWNER":
			ClinicOwner clinicOwner = findClinicOwnerByUser(user.getId());
			return findFeaturesByClinicOwner(clinicOwner);
		default:
			throw new AuthException("Invalid role");
		}
	}

	public Boolean existsUser(String username) {
		return userRepository.existsByUsername(username);
	}

	@Transactional(readOnly = true)
	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	public Iterable<User> findAllByAuthority(String auth) {
		return userRepository.findAllByAuthority(auth);
	}

	@Transactional
	public User updateUser(@Valid User user, Integer idToUpdate) {
		User toUpdate = findUser(idToUpdate);
		BeanUtils.copyProperties(user, toUpdate, "id");
		userRepository.save(toUpdate);

		return toUpdate;
	}

	@Transactional
	public void deleteUser(Integer id) {
		User toDelete = findUser(id);
		deleteRelations(id, toDelete.getAuthority().getAuthority());
//		this.userRepository.deleteOwnerRelation(id);
//		this.userRepository.deleteVetRelation(id);
		this.userRepository.delete(toDelete);
	}

	private void deleteRelations(Integer id, String auth) {
		switch (auth) {
		case "OWNER":
//			Optional<Owner> owner = ownerService.optFindOwnerByUser(id);
//			if (owner.isPresent())
//				ownerService.deleteOwner(owner.get().getId());
			this.userRepository.deleteOwnerRelation(id);
			break;
		case "VET":
			Optional<Vet> vet = vetService.optFindVetByUser(id);
			if (vet.isPresent()) {
				vetService.deleteVet(vet.get().getId());
			}
			break;
		default:
			// The only relations that have user are Owner and Vet
			break;
		}

	}

	private Map<String, Feature> findFeaturesByOwner(Owner owner) {
		
		Map<String, Feature> featureMap = new HashMap<>();

		Plan userPlan = owner.getClinic().getPlan();

		Map<String, Object> planFeatures = parsePlanToMap(userPlan);

		for (String key : planFeatures.keySet()) {
			if(planFeatures.get(key) instanceof Boolean){
				featureMap.put(key, Feature.newBuilder().setValueType(ValueType.BOOLEAN).setBooleanValue((Boolean) planFeatures.get(key)).build());
			}else if(planFeatures.get(key) instanceof Integer){
				featureMap.put(key, Feature.newBuilder().setValueType(ValueType.NUMERIC).setNumericValue((Integer) planFeatures.get(key)).build());
			}else if(planFeatures.get(key) instanceof String){
				featureMap.put(key, Feature.newBuilder().setValueType(ValueType.STRING).setStringValue((String) planFeatures.get(key)).build());
			}
		}
		
		return featureMap;
	}
	private Map<String, Feature> findFeaturesByVet(Vet vet) {
		return new HashMap<>();
	}
	private Map<String, Feature> findFeaturesByAdmin(User admin) {
		return new HashMap<>();
	}
	private Map<String, Feature> findFeaturesByClinicOwner(ClinicOwner clinicOwner) {
		return new HashMap<>();
	}

	private Map<String, Feature> findPublicFeatures() {
		
		Map<String, Feature> featureMap = new HashMap<>();

		featureMap.put("public", Feature.newBuilder().setValueType(ValueType.BOOLEAN).setBooleanValue(true).build());
		
		return featureMap;
	}

	private Map<String, Object> parsePlanToMap(Plan plan){
		Map<String, Object> map = new HashMap<>();

        Field[] fields = plan.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            String fieldName = field.getName();
			if(fieldName.equals("id") || fieldName.equals("name") || fieldName.equals("price")) {
				continue;
			}
			try {
				Object fieldValue = field.get(plan);
				map.put(fieldName, fieldValue);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			}
			
        }

        return map;
	}

}
