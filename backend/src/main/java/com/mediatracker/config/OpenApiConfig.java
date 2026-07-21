package com.mediatracker.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mediaTrackerOpenApi() {
        final String schemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info().title("Media Tracker API").version("0.1.0")
                        .description("Personal Media & Reading Tracker — REST API"))
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList(schemeName))
                .components(new Components().addSecuritySchemes(schemeName,
                        new SecurityScheme()
                                .name(schemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
