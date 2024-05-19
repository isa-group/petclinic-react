package org.springframework.samples.petclinic.configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.github.isagroup.PricingContext;
import jakarta.security.auth.message.AuthException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

@Slf4j
@Component
public class PricingConfiguration extends PricingContext{

    @Autowired
    UserService userService;

    @Value("${petclinic.app.jwtSecret}")
    private String jwtSecret;

    @Override
    public String getConfigFilePath() {
        return "pricing/pricing.yaml";
    }

    @Override
    public String getJwtSecret() {
        return jwtSecret;
    }

    @Override
    public Boolean userAffectedByPricing(){
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();

        UserDetailsImpl userDetails = (UserDetailsImpl) userAuth.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
            .collect(Collectors.toList());
        
        return roles.contains("OWNER");
    }

    @Override
    public Map<String, Object> getUserContext() {
        try {
            return userService.findUserContext();
        } catch (AuthException e) {
            log.info("Anonimous user");
            return new HashMap<>();
        }
    }

    @Override
    public String getUserPlan() {
        try {
            String userPlan = userService.findUserPlan();
            return userPlan;
        } catch (AuthException e) {
            log.info("Anonimous user");
            return "BASIC";
        }
    }
    
}
