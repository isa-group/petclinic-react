package org.springframework.samples.petclinic.configuration;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.security.auth.message.AuthException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.samples.petclinic.plan.Plan;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import io.github.isagroup.PricingContext;
import io.github.isagroup.models.PricingManager;
import io.github.isagroup.services.yaml.YamlUtils;

@Component
public class PricingConfiguration extends PricingContext {

    private static final Logger logger = Logger.getLogger(PricingConfiguration.class.getName());

    @Autowired
    private UserService userService;

    @Value("${petclinic.app.jwtSecret}")
    private String jwtSecret;

    @Override
    public String getJwtSecret(){
        return jwtSecret;
    }

    @Override
    public String getConfigFilePath(){
        return "pricing/petclinic.yml";
    }

    @Override
    public Object getUserAuthorities() {
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();

        Object userAuthorities = new HashMap<>();

        if (!(userAuth.getPrincipal() instanceof String)) {
            UserDetailsImpl userDetails = (UserDetailsImpl) userAuth.getPrincipal();
            userAuthorities = userDetails.getAuthorities().stream().map(auth -> auth.getAuthority())
                    .collect(Collectors.toList());
        }

        return userAuthorities;
    }

    @Override
    public Map<String, Object> getUserContext() {
        try {
            return userService.findUserContext();
        } catch (AuthException e) {
            logger.info("Anonimous user");
            return new HashMap<>();
        }
    }

    @Override
    public String getUserPlan() {
        Plan userPlan;
        try {
            userPlan = userService.findUserPlan();
            return userPlan.getName().toString();
        } catch (AuthException e) {
            logger.info("Anonimous user");
            return "BASIC";
        }
    }
    
}